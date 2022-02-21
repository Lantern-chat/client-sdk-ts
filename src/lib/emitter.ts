
/**
 * Tiny Event-Emitter class
 *
 * @typeparam MAP Event->Callback mapping interface
 */
export class MicroEmitter<MAP extends { [key: string | symbol]: any }> {
    cb: { [P in keyof MAP]?: Array<MAP[P]> } = {};

    emit<K extends keyof MAP>(event: K, ...values: Parameters<MAP[K]>) {
        let listeners: Array<any> = this.cb[event] || [];
        for(let listener of listeners) {
            listener(...values);
        }
    }

    on<K extends keyof MAP>(event: K, cb: MAP[K]): MAP[K] {
        let listeners = this.cb[event] as (Array<MAP[K]> | undefined);
        if(!listeners) { listeners = this.cb[event] = []; }
        listeners.push(cb);
        return cb;
    }

    off<K extends keyof MAP>(event: K, cb: MAP[K]) {
        let listeners = this.cb[event] as (Array<MAP[K]> | undefined);
        if(listeners) { this.cb[event] = listeners.filter(_cb => _cb != cb) as any; }
    }

    once<K extends keyof MAP>(event: K, cb: MAP[K]): MAP[K] {
        let once_cb: any = (...values: Parameters<MAP[K]>) => {
            cb(...values); this.off(event, once_cb);
        };

        return this.on(event, once_cb);
    }
}