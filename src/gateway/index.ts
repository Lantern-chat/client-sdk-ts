import WebSocket, { CloseEvent, ErrorEvent } from "isomorphic-ws";

import type { ServerMsg, ClientMsg } from "../models";

import { zlibSync as compress, unzlibSync as decompress } from 'fflate';
import { MicroEmitter } from "../lib/emitter";

export interface GatewayEventTypes {
    'msg': (msg: ServerMsg) => void,
    'error': (err: ErrorEvent) => void;
    'close': (ev: CloseEvent) => void;
    'open': () => void;
}

export class GatewayError {
    // TODO
}

export const enum SocketState {
    Closed,
    Connecting,
    Connected,
    Errored,
}

/**
 * Lightweight WebSocket wrapper and event-emitter that handles message encoding
 *
 * This does not handle heartbeats or identification.
 * */
export class GatewaySocket extends MicroEmitter<GatewayEventTypes> {
    private ws: WebSocket | null = null;

    private encoder: TextEncoder = new TextEncoder();
    private decoder: TextDecoder = new TextDecoder();

    private s: SocketState = SocketState.Closed;

    /**
     * Connects to the WebSocket, resolving the promise on open or rejecting on error.
     *
     * @param uri Websocket URI
     * @returns Promise<void, ErrorEvent>
     */
    connect(uri: string): Promise<void> {
        this.s = SocketState.Connecting;
        let ws = this.ws = new WebSocket(uri);
        ws.binaryType = 'arraybuffer';

        ws.addEventListener('open', () => {
            this.s = SocketState.Connected;
            this.emit('open');
        });

        ws.addEventListener('message', msg => {
            // decompress, decode, parse, emit
            this.emit('msg', JSON.parse(this.decoder.decode(decompress(new Uint8Array(msg.data as ArrayBuffer)))));
        });

        ws.addEventListener('close', ev => {
            this.ws = null; // ensure closed state
            this.s = SocketState.Closed;
            this.emit('close', ev);
        });

        ws.addEventListener('error', err => {
            this.ws = null; // ensure closed state
            this.s = SocketState.Errored;
            this.emit('error', err);
        });

        return new Promise((resolve, reject) => {
            let resolve_open = this.once('open', () => {
                resolve();
                this.off('error', resolve_err); // cleanup the other
            }), resolve_err = this.once('error', (err: ErrorEvent) => {
                reject(err);
                this.off('open', resolve_open); // cleanup the other
            });
        });
    }

    close() { this.ws?.close(); }

    send(msg: ClientMsg) {
        if(!this.ws) {
            throw new GatewayError();
        }

        // serialize, encode, compress, send
        this.ws.send(compress(this.encoder.encode(JSON.stringify(msg)), { level: 9 }))
    }

    get state(): SocketState {
        return this.s;
    }
}