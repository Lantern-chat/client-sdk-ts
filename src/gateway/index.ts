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

/**
 * Lightweight WebSocket wrapper and event-emitter that handles message encoding
 *
 * This does not handle heartbeats or identification.
 * */
export class GatewaySocket extends MicroEmitter<GatewayEventTypes> {
    ws: WebSocket | null = null;

    encoder: TextEncoder = new TextEncoder();
    decoder: TextDecoder = new TextDecoder();

    /**
     * Connects to the WebSocket, resolving the promise on open or rejecting on error.
     *
     * @param uri Websocket URI
     * @returns Promise<void, ErrorEvent>
     */
    connect(uri: string): Promise<void> {
        let ws = this.ws = new WebSocket(uri);
        ws.binaryType = 'arraybuffer';

        ws.addEventListener('open', () => this.emit('open'));
        ws.addEventListener('message', msg => this.on_msg(msg.data as ArrayBuffer));

        ws.addEventListener('close', ev => {
            this.do_close();
            this.emit('close', ev);
        });

        ws.addEventListener('error', err => {
            this.do_close();
            this.emit('error', err);
        });

        return new Promise((resolve, reject) => {
            let resolve_open = () => {
                resolve();
                this.off('open', resolve_open);
                this.off('error', resolve_err);
            }, resolve_err = (err: ErrorEvent) => {
                reject(err);
                this.off('open', resolve_open);
                this.off('error', resolve_err);
            };

            this.on('open', resolve_open);
            this.on('error', resolve_err);
        });
    }

    do_close() {
        this.ws = null;
    }

    send_msg(msg: ClientMsg) {
        if(!this.ws) {
            throw new GatewayError();
        }

        this.ws.send(compress(this.encoder.encode(JSON.stringify(msg)), { level: 9 }))
    }

    close() {
        this.ws?.close();
    }

    private on_msg(raw: ArrayBuffer) {
        this.emit('msg', JSON.parse(this.decoder.decode(decompress(new Uint8Array(raw)))));
    }
}