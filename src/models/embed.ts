import type { Timestamp } from ".";

export const enum EmbedType {
    Img = "img",
    Audio = "audio",
    Vid = "vid",
    Html = "html",
    Link = "link",
    Article = "article",
}

export interface EmbedMedia {
    url?: string,
    alt?: string,
    proxy_url?: string,
    width?: number,
    height?: number,
    mime?: string,
}

export interface EmbedProvider {
    name?: string,
    url?: string,
}

export interface EmbedAuthor {
    name: string,
    url?: string,
    icon?: EmbedMedia,
}

export interface EmbedField {
    name: string,
    value: string,

    inline?: boolean,
}

export interface EmbedFooter {
    text: string,

    icon?: EmbedMedia,
}

export interface EmbedV1 {
    v: 1,

    ts: Timestamp,
    url?: string,
    ty: EmbedType,
    title?: string,
    desc?: string,
    col?: number,
    author?: EmbedAuthor,
    pro?: EmbedProvider,

    obj?: EmbedMedia,
    img?: EmbedMedia,
    audio?: EmbedMedia,
    vid?: EmbedMedia,
    thumb?: EmbedMedia,

    fields?: EmbedField[],
}

export type Embed = EmbedV1;