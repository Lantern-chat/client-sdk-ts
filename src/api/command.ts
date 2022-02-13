import { XHRMethod } from "lib/fetch";

export enum CommandFlags {
    NONE = 0,
    HAS_BODY = 1 << 0,
    HAS_RESPONSE = 1 << 1,
    AUTHORIZED = 1 << 2,
}

type CommandThis<F, R, B> = Readonly<F> & Command<F, R, B>;

interface Command<F extends NonNullable<any>, R, B> {
    method: XHRMethod;
    flags: CommandFlags,

    perms(this: CommandThis<F, R, B>): number;
    path(this: CommandThis<F, R, B>): string;
    headers(this: CommandThis<F, R, B>): Array<{ [name: string]: string }>,
    body(this: CommandThis<F, R, B>): B;
    parse(this: CommandThis<F, R, B>, req: XMLHttpRequest): R | undefined;
}

const DEFAULT: Command<any, any, any> = {
    method: XHRMethod.GET,
    flags: CommandFlags.NONE,
    perms: () => 0,
    path: () => "",
    headers: () => [],
    body: () => null,
    parse: () => null,
}

function defaultParse<B>(req: XMLHttpRequest): B | undefined {
    if(req.responseType == 'json') {
        return req.response;
    } else if(req.responseText != '') {
        return JSON.parse(req.responseText);
    }
    return;
}

export function command<F, R = null, B = null>(template: Partial<Command<F, R, B>>): (fields: Readonly<F>) => Readonly<F> & Command<F, R, B> {
    let full_template: Command<F, R, B> = Object.assign({}, DEFAULT, template);

    if(template.body) {
        full_template.flags |= CommandFlags.HAS_BODY;
    }

    if(template.parse) {
        full_template.flags |= CommandFlags.HAS_RESPONSE;
    } else if(full_template.method == XHRMethod.GET) {
        // If method is GET, assume there is a body.
        full_template.parse = defaultParse;
        full_template.flags |= CommandFlags.HAS_RESPONSE;
    }

    return function(fields: Readonly<F>) {
        return Object.assign(fields, full_template);
    }
}

command.parse = defaultParse;

function makeMethodCommand(method: XHRMethod): typeof command {
    return function(template) {
        return command({ ...template, method });
    } as typeof command;
}

command.get = makeMethodCommand(XHRMethod.GET);
command.post = makeMethodCommand(XHRMethod.POST);
command.patch = makeMethodCommand(XHRMethod.PATCH);
command.delete = makeMethodCommand(XHRMethod.DELETE);
command.head = makeMethodCommand(XHRMethod.HEAD);
command.options = makeMethodCommand(XHRMethod.OPTIONS);