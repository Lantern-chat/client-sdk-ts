export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type { AuthToken } from "./auth";
export * as auth from "./auth";

export type { Permission, Overwrite } from "./permission";
import { Permission, Overwrite } from "./permission";

export * as perms from "./permission";

export type { ServerMsg, ClientMsg } from "./gateway";
export { ServerMsgOpcode, ClientMsgOpcode, Intent } from "./gateway";

/// Snowflakes cannot be 0
export type Snowflake = Exclude<string, "0" | 0>;

export const enum UserFlags {
    Deleted = 1 << 0,
    Verified = 1 << 1,
    MfaEnabled = 1 << 2,

    // 3 bits
    Elevation = 7 << 6,

    // 3 bits
    Premium = 7 << 9,

    // 2 bits
    ExtraStorage = 3 << 13,
}

export const enum ElevationLevel {
    None = 0,
    Bot = 1,
    Staff = 3,
    System = 4,
}

export interface User {
    id: Snowflake,
    username: string,
    discriminator: number,
    flags: number | UserFlags,
    avatar: string | null,
    status?: string,
    bio?: string,
    email?: string,
    preferences?: Partial<UserPreferences>,
}

export function parse_user_elevation(user: User): ElevationLevel | undefined {
    let flags = (user.flags & UserFlags.Elevation) >> 6;
    switch(flags) {
        case 0: return ElevationLevel.None;
        case 1: return ElevationLevel.Bot;
        case 3: return ElevationLevel.Staff;
        case 4: return ElevationLevel.System;
        default: return;
    }
}

export function user_is_system(user: User): boolean {
    return (user.flags & 256) === 256;
}

export function user_is_bot(user: User): boolean {
    return (user.flags & 64) === 64;
}

export interface AnonymousSession {
    expires: string,
}

export interface Session extends AnonymousSession {
    auth: string,
}

export enum Font {
    SansSerif = 0,
    Serif,
    Monospace,
    Cursive,
    ComicSans,

    OpenDyslexic = 30,
}

export const FONT_NAMES: { [key in keyof typeof Font]: string } = {
    "SansSerif": "Sans Serif",
    "Serif": "Serif",
    "Monospace": "Monospace",
    "Cursive": "Cursive",
    "ComicSans": "Comis Sans",
    "OpenDyslexic": "Open Dyslexic",
}

export const enum UserPreferenceFlags {
    ReduceAnimations = 1 << 0,
    UnfocusPause = 1 << 1,
    LightMode = 1 << 2,
    AllowDms = 1 << 3,
    GroupLines = 1 << 4,
    HideAvatars = 1 << 5,
    OledMode = 1 << 6,
    MuteMedia = 1 << 7,
    HideUnknown = 1 << 8,
    CompactView = 1 << 9,
    UsePlatformEmojis = 1 << 10,
    EnableSpellcheck = 1 << 11,

    DeveloperMode = 1 << 15,
}

export interface UserPreferences {
    locale: number,
    friend_add: number,
    flags: number | UserPreferenceFlags,
    temp: number,
    chat_font: Font,
    ui_font: Font,
    chat_font_size: number,
    ui_font_size: number,
    tab_size: number,
    time_format: string,
    pad: number,
}

export function hasUserPrefFlag(prefs: Pick<UserPreferences, 'flags'>, flag: UserPreferenceFlags): boolean {
    return (prefs.flags & flag) !== 0;
}

export const enum UserPresenceFlags {
    Online = 1 << 0,
    Away = 1 << 1,
    Busy = 1 << 2,
    Mobile = 1 << 3,
}

export interface UserPresence {
    flags: number | UserPresenceFlags,
    updated_at?: string,
    activity?: Activity,
}

export interface Activity { }

export interface Friend {
    note?: string,
    flags: number,
    user: User,
}

export const enum RoomFlags {
    Text = 1 << 0,
    Direct = 1 << 1,
    Voice = 1 << 2,
    Group = 1 << 3,
    Nsfw = 1 << 4,
    Default = 1 << 5,
}

export interface Room {
    id: Snowflake,
    party_id?: Snowflake,
    avatar: string | null,
    name: string,
    topic?: string,
    position: number,
    flags: number | RoomFlags,
    rate_limit_per_user?: number,
    parent_id?: Snowflake,
    overwrites?: Overwrite[],
}

export const enum MessageFlags {
    Deleted = 1 << 0,
    MentionsEveryone = 1 << 1,
    MentionsHere = 1 << 2,
    Pinned = 1 << 3,
    TTS = 1 << 4,
    SupressEmbeds = 1 << 5,
}

export const enum MessageKind {
    Normal = 0,
    Welcome = 1,
}

export interface Message {
    id: Snowflake,
    room_id: Snowflake,
    party_id?: Snowflake,
    kind?: MessageKind,
    author: User,
    member?: PartialPartyMember,
    thread_id?: Snowflake,
    created_at: string,
    edited_at?: string,
    content?: string,
    flags: number | MessageFlags,
    user_mentions?: Snowflake[],
    role_mentions?: Snowflake[],
    room_mentions?: Snowflake[],
    reactions?: Reaction[],
    attachments?: Attachment[],
    embeds?: Embed[],
}

export type Reaction = ReactionShorthand | ReactionFull;

export interface ReactionShorthand {
    emote: Snowflake,
    own: boolean,
    count: number,
}

export interface ReactionFull {
    emote: Emote,
    users: Snowflake[],
}

export interface EmbedMediaAttributes {
    title?: string,
    description?: string,
    url?: string,
    ts?: string,
    color?: number,
}

export const enum EmbedMediaKind {
    Image = "image",
    Video = "video",
    Audio = "audio",
    Thumbnail = "thumbnail",
}

export interface EmbedMedia extends EmbedMediaAttributes {
    type: EmbedMediaKind,
}

export interface Embed {
    // TODO
}

export interface File {
    id: Snowflake,
    filename: string,
    size: number,
    mime?: string,
    width?: number,
    height?: number,
    preview?: string,
}

export const enum AttachmentFlags {
    Spoiler = 1 << 0,
}

export interface Attachment extends File {
    flags?: number | AttachmentFlags,
}

export interface PartialParty {
    id: Snowflake,
    name: string,
    description: string | null,
}

export interface Party extends PartialParty {
    owner: Snowflake,
    security: number,
    roles: Role[],
    emotes?: Emote[],
    avatar: string | null,
    position: number,
    default_room: Snowflake,
}

export interface PartyMember {
    user: User,
    nick: string | null,
    roles?: Snowflake[],
    presence?: UserPresence,
}

export type PartialPartyMember = PartialBy<PartyMember, 'user'>;

export interface Invite {
    code: string,
    party: PartialParty,
    inviter: Snowflake,
    description: string,
}

export interface Role {
    id: Snowflake,
    party_id: Snowflake,
    icon?: string,
    name: string,
    permissions: Permission,
    color: number | null,
    position: number,
    flags: number,
}

export interface CustomEmote {
    id: Snowflake,
    party_id: Snowflake,
    file: Snowflake,
    name: string,
    flags: number,
    aspect_ratio: number,
}

export interface StandardEmote {
    name: string,
}

export type Emote = StandardEmote | CustomEmote;

export const enum PresenceStatus {
    Online,
    Away,
    Busy,
    Offline,
}

export function parse_presence(p?: UserPresence): { status: PresenceStatus, is_mobile: boolean } {
    let status = PresenceStatus.Offline, is_mobile = false;

    if(p) {
        if(p.flags & UserPresenceFlags.Online) status = PresenceStatus.Online;
        else if(p.flags & UserPresenceFlags.Away) status = PresenceStatus.Away;
        else if(p.flags & UserPresenceFlags.Busy) status = PresenceStatus.Busy;
        is_mobile = (p.flags & UserPresenceFlags.Mobile) != 0;
    }

    return { status, is_mobile };
}