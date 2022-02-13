import { Command, CommandFlags } from "api/command";
import { fetch, XHRMethod } from "lib/fetch";
import { Snowflake } from "models";

//import { buf as crc32buf } from "crc-32";
import { encodeInt32ToBase64 } from "lib/base64";

const QUERY_METHODS = [
    XHRMethod.GET,
    XHRMethod.OPTIONS,
    XHRMethod.HEAD,
    XHRMethod.CONNECT,
    XHRMethod.TRACE,
];

export class Driver {
    uri: string;
    bearer: string | null = null;

    constructor(uri: string) {
        this.uri = uri;
    }

    async execute<R>(cmd: Command<any, R, any>): Promise<R> {
        let path = this.uri + "/api/v1" + cmd.path(),
            body = cmd.body();

        // serialize body to query string
        if(QUERY_METHODS.indexOf(cmd.method) != -1) {
            let query = new URLSearchParams(body).toString();

            if(query.length) {
                path += '?' + query;
            }

            body = null;
        }

        let response = await fetch({
            method: cmd.method,
            url: path,
            json: body,
            headers: cmd.headers(),
            bearer: this.bearer,
        });

        let result = cmd.parse(response);

        if(!result && (cmd.flags & CommandFlags.HAS_RESPONSE)) {
            // TODO: Error
        }

        return result!;
    }

    async patch_file(file_id: Snowflake, checksum: number, offset: number, body: ArrayBuffer): Promise<number> {
        let path = this.uri + "/api/v1/file/" + file_id;

        let response = await fetch({
            method: XHRMethod.PATCH,
            url: path,
            bearer: this.bearer,
            headers: {
                "Upload-Offset": offset.toString(),
                "Upload-Checksum": encodeInt32ToBase64(checksum),
                "Content-Type": "application/offset+octet-stream",
            },
            body,
        });

        return 0;
    }
}