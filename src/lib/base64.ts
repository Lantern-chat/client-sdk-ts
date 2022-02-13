/**
 * Largely borrowed from https://github.com/waitingsong/base64
 *
 * @copyright
 *
 * The MIT License (MIT)
 * Copyright (c) waiting
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const LOOKUP: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

function tripletToBase64(pos: number): string {
    return LOOKUP[pos >> 18 & 0x3F] +
        LOOKUP[pos >> 12 & 0x3F] +
        LOOKUP[pos >> 6 & 0x3F] +
        LOOKUP[pos & 0x3F];
}

function encodeChunk(input: Uint8Array, start: number, end: number): string {
    const arrLen = Math.ceil((end - start) / 3),
        ret: string[] = new Array(arrLen);

    for(let i = start, curTriplet = 0; i < end; i += 3, curTriplet += 1) {
        ret[curTriplet] = tripletToBase64(
            (input[i] & 0xFF) << 16 |
            (input[i + 1] & 0xFF) << 8 |
            (input[i + 2] & 0xFF),
        );
    }

    return ret.join('');
}

export function encodeBase64(input: Uint8Array): string {
    const len = input.length,
        extraBytes = len % 3, // if we have 1 byte left, pad 2 bytes
        len2 = len - extraBytes,
        maxChunkLength = 12000, // must be multiple of 3
        parts: string[] = new Array(
            Math.ceil(len2 / maxChunkLength) + (extraBytes ? 1 : 0),
        );

    let curChunk = 0, tmp;

    // go through the array every three bytes, we'll deal with trailing stuff later
    for(let i = 0, nextI = 0; i < len2; i = nextI, curChunk++) {
        nextI = i + maxChunkLength;
        parts[curChunk] = encodeChunk(input, i, Math.min(nextI, len2));
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if(extraBytes === 1) {
        tmp = input[len2] & 0xFF;

        parts[curChunk] =
            LOOKUP[tmp >> 2] +
            LOOKUP[tmp << 4 & 0x3F] + '==';

    } else if(extraBytes === 2) {
        tmp = (input[len2] & 0xFF) << 8 | (input[len2 + 1] & 0xFF);

        parts[curChunk] =
            LOOKUP[tmp >> 10] +
            LOOKUP[tmp >> 4 & 0x3F] +
            LOOKUP[tmp << 2 & 0x3F] + '=';
    }

    return parts.join('')
}

export function encodeUTF8toBase64(s: string): string {
    return encodeBase64((new TextEncoder()).encode(s));
}

export function encodeInt32ToBase64(value: number): string {
    let bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setInt32(0, value);
    return encodeBase64(bytes);
}