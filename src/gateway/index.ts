import WebSocket from "isomorphic-ws";

import type { ServerMsg, ClientMsg } from "../models";

import { zlibSync as compress, unzlibSync as decompress, FlateError } from 'fflate';
import { MicroEmitter } from "../lib/emitter";

export const enum GatewayErrorCode {
    UnknownError = 4000,
    UnknownOpcode = 4001,
    DecodeError = 4002,
    NotAuthenticated = 4003,
    AuthFailed = 4004,

    __MAX,
}

export const enum GatewayErrorKind {
    Disconnected,
    ServerError,
    SocketError,
    Compression,
    Parse,
    Unknown,
}

type GatewayErrorValue =
    | { t: GatewayErrorKind.Disconnected }
    | { t: GatewayErrorKind.ServerError, e: GatewayErrorCode }
    | { t: GatewayErrorKind.SocketError, e: WebSocket.ErrorEvent }
    | { t: GatewayErrorKind.Compression, e: FlateError }
    | { t: GatewayErrorKind.Parse, e: SyntaxError }
    | { t: GatewayErrorKind.Unknown, e: any };

export class GatewayError {
    value: GatewayErrorValue;

    constructor(value: GatewayErrorValue) {
        this.value = value;
    }

    get kind(): GatewayErrorKind {
        return this.value.t;
    }
}

/**
 * Lightweight WebSocket wrapper and event-emitter that handles message encoding
 *
 * This does not handle heartbeats or identification.
 * */
export class GatewaySocket extends MicroEmitter<{
    msg(msg: ServerMsg): void;
    error(err: GatewayError): void;
    close(ev: WebSocket.CloseEvent): void;
    open(): void;
}> {
    private ws: WebSocket | null = null;

    private encoder: TextEncoder = new TextEncoder();
    private decoder: TextDecoder = new TextDecoder();

    /**
     * Connects to the WebSocket, resolving the promise on open or rejecting on error.
     *
     * @param uri Websocket URI
     * @returns Promise<void, GatewayError>
     */
    connect(uri: string): Promise<void> {
        this.close();

        let ws = this.ws = new WebSocket(uri);
        ws.binaryType = 'arraybuffer';

        ws.addEventListener('open', () => this.emit('open'));

        ws.addEventListener('message', (ev: WebSocket.MessageEvent) => {
            try {
                // decompress, decode, parse, emit
                this.emit('msg', JSON.parse(this.decoder.decode(decompress(new Uint8Array(ev.data as ArrayBuffer)))));
            } catch(e) {
                this.emit('error', error(e));
            }
        });

        ws.addEventListener('close', (ev: WebSocket.CloseEvent) => {
            this.ws = null; // ensure closed state
            let code = ev.code;
            if(code >= 4000 && code < GatewayErrorCode.__MAX) {
                this.emit('error', new GatewayError({ t: GatewayErrorKind.ServerError, e: code }));
            }
            this.emit('close', ev);
        });

        ws.addEventListener('error', (e: WebSocket.ErrorEvent) => this.emit('error', new GatewayError({ t: GatewayErrorKind.SocketError, e })));

        return new Promise((resolve, reject) => {
            let resolve_open = this.once('open', () => {
                resolve(); this.off('error', resolve_err); // cleanup the other
            }), resolve_err = this.once('error', (err: GatewayError) => {
                reject(err); this.off('open', resolve_open); // cleanup the other
            });
        });
    }

    close() { this.readyState <= 1 && this.ws?.close() }

    /**
     *
     * @param msg
     * @throws GatewayError
     */
    send(msg: ClientMsg) {
        // if exists and open
        if(this.readyState === 1) {
            try {
                // serialize, encode, compress, send
                this.ws!.send(compress(this.encoder.encode(JSON.stringify(msg)), { level: 9 }))
            } catch(e) {
                throw error(e);
            }
        } else {
            throw new GatewayError({ t: GatewayErrorKind.Disconnected });
        }
    }

    get readyState(): typeof WebSocket.CONNECTING | typeof WebSocket.OPEN | typeof WebSocket.CLOSING | typeof WebSocket.CLOSED {
        return this.ws ? this.ws.readyState : 3; // closed if null
    }
}

function error(e: any): GatewayError {
    let kind = GatewayErrorKind.Unknown;
    if(e instanceof SyntaxError) {
        kind = GatewayErrorKind.Parse;
    } else if(e instanceof Error) {
        kind = GatewayErrorKind.Compression;
    }
    return new GatewayError({ t: kind, e });
}