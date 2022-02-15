class GenericToken {
    token: string;
    prefix: string;

    constructor(token: string, len: number, prefix: string) {
        if(token.length != len) {
            throw new RangeError(`${name}Token must be ${len} characters`);
        }

        this.token = token;
        this.prefix = prefix;
    }

    format(): string {
        return this.prefix + ' ' + this.token;
    }
}

export class BearerToken extends GenericToken {
    /** Throws `RangeError` if the given token is the incorrect length  */
    constructor(token: string) { super(token, 28, "Bearer") }
}

export class BotToken extends GenericToken {
    /** Throws `RangeError` if the given token is the incorrect length  */
    constructor(token: string) { super(token, 64, "Bot") }
}

export type AuthToken = BearerToken | BotToken;