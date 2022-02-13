import { Command } from "api/command";
import { GetMessage } from "api/commands/room";
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

        return void 0 as any;
    }
}