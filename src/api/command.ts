import { XHRMethod } from "../lib/fetch";
import { EMPTY, Permission, union } from "../models/permission";

export enum CommandFlags {
    HAS_BODY = 1 << 0,
    HAS_RESPONSE = 1 << 1,
    UNAUTHORIZED = 1 << 2,
}

type CommandThis<F, R, B> = Readonly<F> & Command<F, R, B>;

/**
 * Abstract Command interface
 *
 * @typeparam F Fields
 * @typeparam R Return type
 * @typeparam B Body type
 */
export interface Command<F extends NonNullable<any>, R, B> {
    method: XHRMethod;
    flags: CommandFlags,

    perms(this: CommandThis<F, R, B>): Permission;
    path(this: CommandThis<F, R, B>): string;
    headers(this: CommandThis<F, R, B>): { [name: string]: string },
    body(this: CommandThis<F, R, B>): B;
    parse(this: CommandThis<F, R, B>, req: XMLHttpRequest): R | null;
}

function defaultParse<B>(req: XMLHttpRequest): B | null {
    switch(req.responseType) {
        case 'json': return req.response;
        case '':
        case 'text': return JSON.parse(req.responseText);
        default: return null;
    }
}

// https://stackoverflow.com/a/49752227/2083075
// Keys of F to fields that are a subtype of B
type BodyKeys<F, B> = keyof { [P in keyof F as F[P] extends B ? P : never]: any }

// TODO: Better way to do this?
export interface CommandTemplate<F, R, B> extends Omit<Command<F, R, B>, 'perms' | 'path' | 'body'> {
    // object literal of callback
    perms: Partial<Permission> | ((this: CommandThis<F, R, B>) => Permission);
    // string literal or callback
    path: string | ((this: CommandThis<F, R, B>) => string);
    // Either key to a field or callback
    body: BodyKeys<F, B> | ((this: CommandThis<F, R, B>) => B);
}

const DEFAULT: Command<any, any, any> = {
    method: XHRMethod.GET,
    flags: 0,
    perms: () => EMPTY,
    path: () => "",
    headers: () => ({}),
    body: () => null,
    parse: () => null,
}

/// methods that automatically parse the body
const GET_METHODS: Array<XHRMethod> = [XHRMethod.GET, XHRMethod.OPTIONS];

/**
 * Created command instance combined with given fields.
 *
 * @typeparam F Fields
 * @typeparam R Return type
 * @typeparam B Body type
 */
export type CommandInstance<F, R, B> = Readonly<F> & Command<F, R, B>;

export function command<F, R = null, B = null>(template: Partial<CommandTemplate<F, R, B>>): (fields: Readonly<F>) => CommandInstance<F, R, B> {
    let full_template: Command<F, R, B> = Object.assign({}, DEFAULT, template);

    if(template.body) {
        full_template.flags |= CommandFlags.HAS_BODY;
    }

    if(template.perms && typeof template.perms !== 'function') {
        let perms = union(template.perms);
        full_template.perms = () => perms;
    }

    if(template.path && typeof template.path === 'string') {
        let path = template.path;
        full_template.path = () => path;
    }

    if(template.body && typeof template.body === 'string') {
        let field = template.body;
        // TODO: Figure out how to reconcile this[field]
        full_template.body = function() { return this[field as any]; };
    }

    if(template.parse) {
        full_template.flags |= CommandFlags.HAS_RESPONSE;
    } else if(GET_METHODS.indexOf(full_template.method) != -1) {
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
command.del = makeMethodCommand(XHRMethod.DELETE);
command.head = makeMethodCommand(XHRMethod.HEAD);
command.options = makeMethodCommand(XHRMethod.OPTIONS);
