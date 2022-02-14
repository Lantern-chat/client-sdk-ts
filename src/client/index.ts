import { CreateFile, CreateFileBody } from "api/commands/file";
import { Driver } from "driver";
import { AuthToken, Snowflake } from "models";

import { buf as crc32buf } from "crc-32";

const CHUNK_SIZE = 1024 * 1024 * 8;

export class Client {
    driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    set_auth(auth: AuthToken | null) {
        this.driver.auth = auth;
    }

    async upload_stream(meta: Omit<CreateFileBody, 'size'>, stream: Blob, progress?: () => void): Promise<Snowflake> {
        let file_id = await this.driver.execute(CreateFile({ params: { ...meta, size: stream.size } }));

        let offset = 0;

        while(offset < stream.size) {
            let chunk = stream.slice(offset, offset + CHUNK_SIZE);

            let buf = await chunk.arrayBuffer();
            let checksum = crc32buf(new Uint8Array(buf));

            let expected_offset = offset + chunk.size;

            offset = await this.driver.patch_file(file_id, checksum, offset, buf, progress);

            if(offset != expected_offset) {
                // TODO: throw error
            }
        }

        return file_id;
    }
}