import { Command, CommandFlags } from "api/command";
import { fetch } from "lib/fetch";

export class Driver {
    uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    async execute<R>(cmd: Command<any, R, any>): Promise<R> {
        let response = await fetch({
            method: cmd.method,
            url: this.uri + cmd.path(),
            json: cmd.body(),
            headers: cmd.headers(),
        });

        let result = cmd.parse(response);

        if(!result && (cmd.flags & CommandFlags.HAS_RESPONSE)) {
            // TODO: Error
        }

        return result!;
    }
}