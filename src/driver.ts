import { command, Command, CommandFlags } from "api/command";
import { ApiError } from "api/error";
import { fetch, XHRMethod } from "lib/fetch";
import { Snowflake } from "models";

//import { buf as crc32buf } from "crc-32";
import { encodeInt32ToBase64 } from "lib/base64";

export enum DriverErrorCode {
    MissingResponse,
    HttpError,
}

export interface HttpError {
    code: DriverErrorCode.HttpError,
    xhr?: XMLHttpRequest,
}

export type DriverErrors = HttpError | { code: DriverErrorCode.MissingResponse };

export class DriverError {
    error: DriverErrors;

    constructor(error: DriverErrors) {
        this.error = error;
    }
}

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
        if(body && QUERY_METHODS.indexOf(cmd.method) != -1) {
            let query = new URLSearchParams(body).toString();

            if(query.length) {
                path += '?' + query;
            }

            body = null;
        }

        try {
            let response = await fetch({
                method: cmd.method,
                url: path,
                json: body,
                headers: cmd.headers(),
                bearer: this.bearer,
            });

            let result = cmd.parse(response);

            if(!result && (cmd.flags & CommandFlags.HAS_RESPONSE)) {
                throw new DriverError({ code: DriverErrorCode.MissingResponse });
            }

            return result!;
        } catch(e) {
            throw driver_error(e);
        }
    }

    async patch_file(file_id: Snowflake, checksum: number, offset: number, body: ArrayBuffer, progress?: (e: ProgressEvent) => void): Promise<number> {
        let path = this.uri + "/api/v1/file/" + file_id;

        try {
            let response = await fetch({
                method: XHRMethod.PATCH,
                upload: true,
                url: path,
                bearer: this.bearer,
                onprogress: progress,
                headers: {
                    "Upload-Offset": offset.toString(),
                    "Upload-Checksum": encodeInt32ToBase64(checksum),
                    "Content-Type": "application/offset+octet-stream",
                },
                body,
            });

            let new_offset = response.getResponseHeader("Upload-Offset");

            if(!new_offset) {
                throw new DriverError({ code: DriverErrorCode.MissingResponse });
            }

            return parseInt(new_offset);
        } catch(e) {
            throw driver_error(e);
        }
    }
}

function driver_error(e: any): any {
    if(e instanceof XMLHttpRequest) {
        if(e.readyState == 4) {
            // just reuse command response parse logic
            let err = command.parse<any>(e);
            if(err && err.code && err.message) {
                return ApiError.from_obj(err);
            }
        }

        return new DriverError({ code: DriverErrorCode.HttpError, xhr: e });
    }

    if(e instanceof ProgressEvent) {
        return new DriverError({ code: DriverErrorCode.HttpError });
    }

    return e;
}