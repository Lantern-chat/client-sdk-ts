import type { Timestamp } from ".";

export const enum EmbedType {
    Img = "img",
    Audio = "audio",
    Vid = "vid",
    Html = "html",
    Link = "link",
    Article = "article",
}

export const enum EmbedFlags {
    Spoiler = 1 << 0,
    Adult = 1 << 1,
}

export interface EmbedMedia {
    // URL
    u?: string,
    alt?: string,
    /// Cryptographic Signature
    s?: string,

    /// Width
    w?: number,
    /// Height
    h?: number,

    /// MIME type
    m?: string,
}

export interface EmbedProvider {
    /// Name
    n?: string,
    /// URL
    u?: string,
    /// Icon media
    i?: EmbedMedia,
}

export interface EmbedAuthor {
    /// Name
    n: string,
    /// URL
    u?: string,
    /// Icon Media
    i?: EmbedMedia,
}

export interface EmbedField {
    /// Name
    n: string,
    /// Value
    v: string,

    img?: EmbedMedia,

    /// Block layout
    b?: boolean
}

export interface EmbedFooter {
    /// Text
    t: string,

    /// Icon Media
    i?: EmbedMedia,
}

export interface EmbedV1 {
    v: 1,

    ts: Timestamp,
    /// URL
    u?: string,
    ty: EmbedType,
    /// Title
    t?: string,
    /// Description
    d?: string,
    /// Canonical URL
    c?: string,

    /// Accent color
    ac?: number,
    /// Author
    au?: EmbedAuthor,
    /// Provider
    p?: EmbedProvider,

    obj?: EmbedMedia,
    img?: EmbedMedia,
    audio?: EmbedMedia,
    vid?: EmbedMedia,
    thumb?: EmbedMedia,

    fields?: EmbedField[],

    footer?: EmbedFooter,
}

export type Embed = EmbedV1;