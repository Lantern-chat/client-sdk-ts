import { CreateFile, CreateFileBody } from "../api/commands/file";
import { Driver } from "../driver";

import type { AuthToken, Snowflake } from "../models";
import type { Command } from "../api/command";

const CHUNK_SIZE = 1024 * 1024 * 8;

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

    async upload_stream(meta: Omit<CreateFileBody, 'size'>, stream: Blob, progress?: () => void): Promise<Snowflake> {
        let file_id = await this.driver.execute(CreateFile({ params: { ...meta, size: stream.size } }));

        let offset = 0;

        while(offset < stream.size) {
            let chunk = stream.slice(offset, offset + CHUNK_SIZE),
                expected_offset = offset + chunk.size;

            offset = await this.driver.patch_file(file_id, offset, await chunk.arrayBuffer(), progress);

            if(offset != expected_offset) {
                // TODO: throw error
            }
        }

        return file_id;
    }
}