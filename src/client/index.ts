import { CreateFile, CreateFileBody } from "../api/commands/file";
import { Driver } from "../driver";

import type { AuthToken, Snowflake } from "../models";
import type { Command } from "../api/command";

const CHUNK_SIZE = 1024 * 1024 * 8;

export interface IStreamUpload {
    id: number,
    meta: Omit<CreateFileBody, 'size'>,
    stream: Blob,
}

export class Client {
    driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    set_auth(auth: AuthToken | null) {
        this.driver.auth = auth;
    }

    execute<R>(cmd: Command<any, R, any>): Promise<R> {
        return this.driver.execute(cmd);
    }

    async upload_stream_id(file_id: Snowflake, stream: Blob, onprogress?: (sent: number, total: number) => void): Promise<Snowflake> {
        let offset = 0;

        while(offset < stream.size) {
            let chunk = stream.slice(offset, offset + CHUNK_SIZE),
                expected_offset = offset + chunk.size;

            offset = await this.driver.patch_file(file_id, offset, await chunk.arrayBuffer(), e => {
                onprogress?.(e.loaded + offset, stream.size);
            });

            if(offset != expected_offset) {
                // TODO: throw error
            }

            onprogress?.(expected_offset, stream.size);
        }

        return file_id;
    }

    create_file(meta: Omit<CreateFileBody, 'size'>, stream: Blob): Promise<Snowflake> {
        return this.driver.execute(CreateFile({ params: { ...meta, size: stream.size } }));
    }

    async upload_stream(meta: Omit<CreateFileBody, 'size'>, stream: Blob, onprogress?: (sent: number, total: number) => void): Promise<Snowflake> {
        let file_id = await this.create_file(meta, stream);
        return this.upload_stream_id(file_id, stream, onprogress);
    }

    async upload_streams(streams: Array<IStreamUpload>, onprogress?: (id: number, sent: number, total: number) => void): Promise<Array<Snowflake>> {
        let uploads = [];

        for(let s of streams) {
            let file_id = await this.create_file(s.meta, s.stream);
            uploads.push(this.upload_stream_id(file_id, s.stream, (sent, total) => onprogress?.(s.id, sent, total)));
        }

        return await Promise.all(uploads);
    }
}