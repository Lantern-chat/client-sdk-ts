import type { RawAuthToken } from ".";

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

// NOTE: Keep these in sync with the lengths in client-sdk-rs

export class BearerToken extends GenericToken {
    /** Throws `RangeError` if the given token is the incorrect length  */
    constructor(token: RawAuthToken) { super(token, 28, "Bearer"); }
}

export class BotToken extends GenericToken {
    /** Throws `RangeError` if the given token is the incorrect length  */
    constructor(token: RawAuthToken) { super(token, 48, "Bot"); }
}

/** Strict AuthToken type that can be formatted into an Authorization header. */
export type AuthToken = BearerToken | BotToken;