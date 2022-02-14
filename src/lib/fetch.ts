export enum XHRMethod {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    PATCH = "PATCH",
}

export interface XHRParameters {
    url: string,
    type?: XMLHttpRequestResponseType,
    body?: Document | XMLHttpRequestBodyInit,
    method?: XHRMethod,
    timeout?: number,
    bearer?: string | null,
    onprogress?: (this: XMLHttpRequest, ev: ProgressEvent) => any;
    headers?: { [header: string]: string | null | undefined },
    json?: any,
    upload?: boolean,
}

/// Tiny custom fetch function with progress
export function fetch(params: string | XHRParameters): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
        try {
            if(typeof params === "string") {
                params = { url: params };
            }

            let xhr = new XMLHttpRequest(), ev = params.upload ? xhr.upload : xhr;
            xhr.responseType = params.type || "json";

            if(params.timeout) { xhr.timeout = params.timeout; }

            ev.onprogress = params.onprogress || null;
            ev.onerror = (e: ProgressEvent) => reject(e);

            // trigger this when server responds, not when the upload finishes
            xhr.addEventListener('loadend', () => {
                //if(xhr.readyState != 4) return;

                if(xhr.status >= 200 && xhr.status < 400) { resolve(xhr); }
                else { reject(xhr); }
            });

            xhr.open(params.method || "GET", params.url);

            if(params.headers) {
                for(let key in params.headers) {
                    let value = params.headers[key];
                    if(value) xhr.setRequestHeader(key, value);
                }
            }

            if(params.bearer) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + params.bearer);
            }

            if(params.json) {
                params.body = JSON.stringify(params.json);
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.send(params.body);
        } catch(e) { reject(e); }
    });
}
