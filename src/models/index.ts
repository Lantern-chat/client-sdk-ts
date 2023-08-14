export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type { AuthToken } from "./auth";
export * as auth from "./auth";

export type { Permissions, Overwrite, PermissionBit } from "./permission";
import type { RawPermissions, RawOverwrite } from "./permission";

export * as perms from "./permission";

export type { ServerMsg, ClientMsg } from "./gateway";
export { ServerMsgOpcode, ClientMsgOpcode, Intent } from "./gateway";

export { EmbedType, EmbedFlags } from "./embed";
export type { Embed, EmbedV1, EmbedMedia, EmbedAuthor, EmbedField, EmbedFooter, EmbedProvider } from "./embed";
import type { Embed } from "./embed";

/// Snowflakes cannot be 0
export type Snowflake = Exclude<string, "0" | 0>;

export const LANTERN_EPOCH = 1550102400000;

/**
 * Extracts the unix timestamp (milliseconds) from a snowflake
 * @param id Snowflake
 * @returns number
 */
export function snowflake_unix(id: Snowflake): number {
    return Number(BigInt(id) >> 22n) + LANTERN_EPOCH;
}

/**
 * Create a snowflake from a unix timestamp (milliseconds)
 * @param ms number
 * @returns Snowflake
 */
export function unix_snowflake(ms: number): Snowflake {
    return (BigInt(ms - LANTERN_EPOCH) << 22n).toString();
}

/// ISO 8601 timestamp
export type Timestamp = string;

export type Cursor = { after: Snowflake; } | { before: Snowflake; } | { exact: Snowflake; };

export interface ServerConfig {
    hcaptcha_sitekey: string,
    cdn: string,
    min_age: number,
    secure: boolean,
    limits: ServerLimits,
    /// If true, pass embedded content through a "camo"/camouflage route at `${cdn}/camo/base64_url/url_signature`
    camo: boolean,
}

export interface ServerLimits {
    max_upload_size: number,
    max_avatar_size: number,
    max_banner_size: number,
    max_avatar_pixels: number,
    max_banner_pixels: number,
    avatar_width: number,
    banner_width: number,
    banner_height: number,
}

export const enum UserFlags {
    Banned = 1 << 0,
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

/**
 * Unpacked values from UserProfile.bits
 */
export interface UserProfileSplitBits {
    roundedness: number,
    override_color: boolean,
    color: number,
}

export interface UserProfile {
    bits: number,
    nick?: string | null,
    avatar?: string | null,
    banner?: string | null,
    status?: string | null,
    bio?: string | null,
}

/**
 * Unpacks the packed bits of the user profile
 *
 * @param param0 UserProfile
 * @returns UserProfileSplitBits
 */
export const split_profile_bits = ({ bits }: UserProfile): UserProfileSplitBits => ({
    roundedness: (bits & 0x7F) / 127.0,
    override_color: (bits & 0x80) != 0,
    color: bits >> 8
});

export interface User {
    id: Snowflake,
    username: string,
    discriminator: number,
    flags: number | UserFlags,
    profile?: UserProfile | null,
    email?: string,
    preferences?: Partial<UserPreferences>,
    presence: UserPresence,
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
    Serif = 1,
    Monospace = 2,
    Cursive = 3,
    ComicSans = 4,

    OpenDyslexic = 30,
    AtkinsonHyperlegible = 31,
}

export const FONT_NAMES: { [key in keyof typeof Font]: string } = {
    "SansSerif": "Sans Serif",
    "Serif": "Serif",
    "Monospace": "Monospace",
    "Cursive": "Cursive",
    "ComicSans": "Comis Sans",
    "OpenDyslexic": "Open Dyslexic",
    "AtkinsonHyperlegible": "Atkinson Hyperlegible",
};

export enum UserPreferenceFlags {
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
    LowBandwidthMode = 1 << 12,
    ForceColorConstrast = 1 << 13,
    ShowMediaMetadata = 1 << 14,
    DeveloperMode = 1 << 15,
    ShowDateChange = 1 << 16,
    HideLastActive = 1 << 17,
    ShowGreyImageBg = 1 << 18,
    ShowAttachmentGrid = 1 << 19,
    SmallerAttachments = 1 << 20,
    HideAllEmbeds = 1 << 21,
    HideNsfwEmbeds = 1 << 22,
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
    Away = 1 << 0,
    Mobile = 1 << 1,
    Online = 1 << 2,
    Busy = 1 << 3,
    Invisible = 1 << 4,
}

export interface UserPresence {
    flags: number | UserPresenceFlags,
    updated_at?: Timestamp,

    /// Approximate Time since last active, in decaseconds
    last_active?: number,
    activity?: Activity,
}

export interface Activity { }

export const enum UserRelationship {
    None = 0,

    Friend = 1,

    //
    // reserve some space for future relationships
    //

    /// Normal user blocking
    Blocked = 100,

    /// Blocking + hide messages from the blocked user
    BlockedDangerous = 101,
}

export interface Relationship {
    note?: string,
    user: User,
    since: Timestamp,
    rel: UserRelationship,

    /// If this relationship is awaiting action from you
    pending?: boolean,
}

export const enum RoomKind {
    Text = 0,
    DirectMessage = 1,
    GroupMessage = 2,
    Voice = 3,
    Feed = 4,
    // max value cannot exceed 15
    __MAX,
}

export const enum RoomFlags {
    Kind = 0xF, // first four bits are the kind
    Nsfw = 1 << 4,
    Default = 1 << 5,
}

export function room_kind(flags: RoomFlags & number): RoomKind {
    let bits = flags & 0xF;
    return bits < RoomKind.__MAX ? bits as RoomKind : RoomKind.Text;
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
    overwrites?: RawOverwrite[],
}

export const enum MessageFlags {
    Deleted = 1 << 0,
    Removed = 1 << 1,
    Parent = 1 << 2,

    MentionsEveryone = 1 << 3,
    MentionsHere = 1 << 4,
    TTS = 1 << 5,
    SupressEmbeds = 1 << 10,

    /// Set if the message has been starred by the user requesting it
    Starred = 1 << 12,
}

export const enum MessageKind {
    Normal = 0,
    Welcome = 1,
    Ephemeral = 2,
    Unavailable = 3,
}

export interface Message {
    id: Snowflake,
    room_id: Snowflake,
    party_id?: Snowflake,
    kind?: MessageKind,
    author: User,
    member?: PartialPartyMember,
    parent?: Snowflake,
    edited_at?: Timestamp,
    content?: string,
    flags: number | MessageFlags,
    user_mentions?: Snowflake[],
    role_mentions?: Snowflake[],
    room_mentions?: Snowflake[],
    reactions?: Reaction[],
    attachments?: Attachment[],
    embeds?: Embed[],
    pins?: Snowflake[],
    score?: number,
}

export interface PinFolder {
    id: Snowflake,
    name: string,
    icon_id?: Snowflake,
    description?: string,
}

export type Reaction = ReactionShorthand | ReactionFull;

export type EmoteOrEmoji = { emote: Snowflake; } | { emoji: string; };

export type ReactionShorthand = EmoteOrEmoji & {
    me: boolean,
    count: number,
};

export type ReactionFull = EmoteOrEmoji & {
    users: Snowflake[],
};


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
    banner?: string | null,
    position: number,
    default_room: Snowflake,
}

export interface PartialPartyMember {
    // Will be null if the user is no longer a member
    joined_at: Timestamp | null,
    roles?: Snowflake[],
    flags?: number,
}

export interface PartyMember extends PartialPartyMember {
    user: User,
}

export interface Invite {
    code: string,
    party: PartialParty,
    inviter?: Snowflake,
    description?: string,
    expires?: string,
    remaining?: number,
}

export const enum RoleFlags {
    Hoist = 1 << 0,
    Mentionable = 1 << 1,
}

export interface Role {
    id: Snowflake,
    party_id: Snowflake,
    icon?: string,
    name: string,
    permissions: RawPermissions,
    color: number | null,
    position: number,
    flags: RoleFlags,
}

export interface CustomEmote {
    id: Snowflake,
    party_id: Snowflake,
    asset: Snowflake,
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

export function parse_presence(p?: UserPresence): { status: PresenceStatus, is_mobile: boolean; } {
    let status = PresenceStatus.Offline, is_mobile = false;

    if(p) {
        if(p.flags & UserPresenceFlags.Online) status = PresenceStatus.Online;
        else if(p.flags & UserPresenceFlags.Away) status = PresenceStatus.Away;
        else if(p.flags & UserPresenceFlags.Busy) status = PresenceStatus.Busy;
        is_mobile = (p.flags & UserPresenceFlags.Mobile) != 0;
    }

    return { status, is_mobile };
}

export const enum AssetFlags {
    QUALITY = 127, // lower 7 bits

    HAS_ALPHA = 1 << 8,
    ANIMATED = 1 << 9,

    FORMAT_PNG = 1 << 10,
    FORMAT_JPEG = 1 << 11,
    FORMAT_GIF = 1 << 12,
    FORMAT_AVIF = 1 << 13,
    FORMAT_WEBM = 1 << 14,

    /// All formats together, a bit for each shifted by the lowest
    FORMATS = 0b11111 << 10,
}

export function asset_flags(quality: number, formats: AssetFlags, has_alpha: boolean = true, animated: boolean = true): AssetFlags {
    return Math.max(Math.min(127, quality), 0) |
        (formats & AssetFlags.FORMATS) |
        (has_alpha ? AssetFlags.HAS_ALPHA : 0) |
        (animated ? AssetFlags.ANIMATED : 0);
}