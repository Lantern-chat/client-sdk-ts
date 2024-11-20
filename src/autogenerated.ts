import type { Snowflake, Timestamp, RawPermissions } from './models';
import { command } from './api/command';

/** OpCodes for [`ServerMsg`] */
export const enum ServerMsgOpcode {
    Hello = 0,
    HeartbeatAck = 1,
    Ready = 2,
    InvalidSession = 3,
    PartyCreate = 4,
    PartyUpdate = 5,
    PartyDelete = 6,
    RoleCreate = 7,
    RoleUpdate = 8,
    RoleDelete = 9,
    MemberAdd = 10,
    MemberUpdate = 11,
    MemberRemove = 12,
    MemberBan = 13,
    MemberUnban = 14,
    RoomCreate = 15,
    RoomUpdate = 16,
    RoomDelete = 17,
    RoomPinsUpdate = 18,
    MessageCreate = 19,
    MessageUpdate = 20,
    MessageDelete = 21,
    MessageReactionAdd = 22,
    MessageReactionRemove = 23,
    MessageReactionRemoveAll = 24,
    MessageReactionRemoveEmote = 25,
    PresenceUpdate = 26,
    TypingStart = 27,
    UserUpdate = 28,
    ProfileUpdate = 29,
    RelationAdd = 30,
    RelationRemove = 31,
}

export interface Hello {
    /** Number of milliseconds between heartbeats */
    heartbeat_interval: number,
}

/**
 * The Hello message initiates the gateway session and expects a [ClientMsg::Identify] in return.
 *
 * Payload struct for [`ServerMsg::Hello`]
 */
export type HelloPayload = Hello;

/**
 * Acknowledgement of a heartbeat
 *
 * Payload struct for [`ServerMsg::HeartbeatAck`]
 */
export interface HeartbeatAckPayload {
}

export const enum ElevationLevel {
    None = 0,
    Bot = 1,
    Reserved = 2,
    Staff = 3,
    System = 4,
}

/** Bitflags for UserFlags */
export const enum UserFlags {
    BANNED = 0x1,
    VERIFIED = 0x2,
    MFA_ENABLED = 0x4,
    NEEDS_PASSWORD_RESET = 0x8,
    RESERVED_1 = 0x10,
    RESERVED_2 = 0x20,
    ELEVATION_1 = 0x40,
    ELEVATION_2 = 0x80,
    ELEVATION_3 = 0x100,
    PREMIUM_1 = 0x200,
    PREMIUM_2 = 0x400,
    PREMIUM_3 = 0x800,
    RESERVED_3 = 0x1000,
    EXTRA_STORAGE_1 = 0x2000,
    EXTRA_STORAGE_2 = 0x4000,
    RESERVED_4 = 0x8000,
    /** All reserved bits for future use */
    RESERVED = 0x9030,
    /** Always strip these from public responses */
    PRIVATE_FLAGS = 0xf03f,
    /** elevation level integer */
    ELEVATION = 0x1c0,
    /** premium level integer */
    PREMIUM = 0xe00,
    /** extra storage level integer */
    EXTRA_STORAGE = 0x6000,
    /** All bitflags of UserFlags */
    ALL = 0xffff,
}

/** Bitflags for UserProfileBits */
export const enum UserProfileBits {
    AVATAR_ROUNDNESS = 0x7f,
    OVERRIDE_COLOR = 0x80,
    PRIMARY_COLOR = 0xffffff00,
    /** All bitflags of UserProfileBits */
    ALL = 0xffffffff,
}

/** Bitflags for ExtraUserProfileBits */
export const enum ExtraUserProfileBits {
    OVERRIDE_COLOR = 0x80,
    SECONDARY_COLOR = 0xffffff00,
    /** All bitflags of ExtraUserProfileBits */
    ALL = 0xffffff80,
}

export interface UserProfile {
    bits: UserProfileBits,
    extra?: ExtraUserProfileBits,
    nick?: string | null,
    avatar?: string | null,
    banner?: string | null,
    status?: string | null,
    bio?: string | null,
}

export const enum Locale {
    enUS = 0,
}

/** Bitflags for UserPrefsFlags */
export const enum UserPrefsFlags {
    /** Reduce movement and animations in the UI */
    REDUCE_ANIMATIONS = 0x1,
    /** Pause animations on window unfocus */
    UNFOCUS_PAUSE = 0x2,
    LIGHT_MODE = 0x4,
    /** Allow direct messages from shared server memmbers */
    ALLOW_DMS = 0x8,
    /** Show small lines between message groups */
    GROUP_LINES = 0x10,
    HIDE_AVATARS = 0x20,
    /** Display dark theme in an OLED-compatible mode */
    OLED_MODE = 0x40,
    /** Mute videos/audio by default */
    MUTE_MEDIA = 0x80,
    /** Hide images/video with unknown dimensions */
    HIDE_UNKNOWN_DIMENSIONS = 0x100,
    COMPACT_VIEW = 0x200,
    /** Prefer browser/platform emojis rather than twemoji */
    USE_PLATFORM_EMOJIS = 0x400,
    ENABLE_SPELLCHECK = 0x800,
    LOW_BANDWIDTH_MODE = 0x1000,
    FORCE_COLOR_CONSTRAST = 0x2000,
    /** Displays information like mime type and file size */
    SHOW_MEDIA_METADATA = 0x4000,
    DEVELOPER_MODE = 0x8000,
    SHOW_DATE_CHANGE = 0x10000,
    HIDE_LAST_ACTIVE = 0x20000,
    /**
     * Show grey background color for images
     * (helps keep transparent pixels consistent)
     */
    SHOW_GREY_IMAGE_BG = 0x40000,
    /**
     * When multiple attachments are present, condense them
     * into a grid to avoid cluttering the channel
     */
    SHOW_ATTACHMENT_GRID = 0x80000,
    SMALLER_ATTACHMENTS = 0x100000,
    HIDE_ALL_EMBEDS = 0x200000,
    HIDE_NSFW_EMBEDS = 0x400000,
    /**
     * Default user flags for creating a new user:
     * - ALLOW_DMS
     * - GROUP_LINES
     * - ENABLE_SPELLCHECK
     * - SHOW_MEDIA_METADATA
     * - SHOW_DATE_CHANGE
     * - SHOW_GREY_IMAGE_BG
     * - SHOW_ATTACHMENT_GRID
     */
    DEFAULT = 0xd4818,
    /** All bitflags of UserPrefsFlags */
    ALL = 0x7fffff,
}

export const enum FriendAddability {
    None = 0,
    FriendsOfFriends = 10,
    ServerMembers = 20,
    Anyone = 30,
}

/** Color temperature in Kelvin */
export type Temperature = number;

export enum Font {
    SansSerif = 0,
    Serif = 1,
    Monospace = 2,
    Cursive = 3,
    ComicSans = 4,
    OpenDyslexic = 30,
    AtkinsonHyperlegible = 31,
}

/** Font size in points */
export type FontSize = number;

/** Message padding in pixels */
export type Padding = number;

/** Tab size in spaces */
export type TabSize = number;

/**
 * User preferences
 *
 * Field names are shortened to reduce message size
 * when stored in a database or sent over the network.
 * However, fields can still be deserialized using the
 * provided aliases, documented for each field.
 */
export interface UserPreferences {
    /** User locale (alias `locale`) */
    l?: Locale,
    /** User preferences flags (alias `flags`) */
    f?: UserPrefsFlags,
    /** Who can add you as a friend (alias `friend_add`) */
    fr?: FriendAddability,
    /** Color temperature in Kelvin (alias `temperature`) */
    temp?: Temperature,
    /** Chat font (alias `chat_font`) */
    cf?: Font,
    /** UI font (alias `ui_font`) */
    uf?: Font,
    /** Chat font size in points (alias `chat_font_size`) */
    cfs?: FontSize,
    /** UI font size in points (alias `ui_font_size`) */
    ufs?: FontSize,
    /** message padding in pixels (alias `padding`) */
    pad?: Padding,
    /** tab size in spaces (alias `tab_size`) */
    tab?: TabSize,
}

/** Bitflags for UserPresenceFlags */
export const enum UserPresenceFlags {
    OFFLINE = 0x0,
    AWAY = 0x1,
    MOBILE = 0x2,
    ONLINE = 0x4,
    BUSY = 0x8,
    INVISIBLE = 0x10,
    /** All bitflags of UserPresenceFlags */
    ALL = 0x1f,
}

export interface Activity {
}

export type AnyActivity = Activity;

export interface UserPresence {
    flags: UserPresenceFlags,
    /**
     * approximately how many seconds ago they were active
     * not present in all events or if user has disabled it
     */
    last_active?: number,
    /** Updated-At timestamp as ISO-8061 */
    updated_at?: Timestamp,
    activity?: AnyActivity,
}

export interface User {
    id: Snowflake,
    username: string,
    /** Unsigned 16-bit integer */
    discriminator: number,
    flags: UserFlags,
    profile?: UserProfile | null,
    /** Not present when user isn't self */
    email?: string,
    /** Not present when user isn't self */
    preferences?: UserPreferences,
    presence?: UserPresence,
}

/** Bitflags for PartyFlags */
export const enum PartyFlags {
    /** Must have a verified email address */
    EMAIL = 0x1,
    /** Must have a verified phone number */
    PHONE = 0x2,
    /** Must be a Lantern user for longer than 5 minutes */
    NEW_USER = 0x4,
    /** Must be a member of the server for longer than 10 minutes */
    NEW_MEMBER = 0x8,
    /** Must have MFA enabled */
    MFA_ENABLED = 0x10,
    /**
     * Party is marked as "adult"
     *
     * This affects viewing on iOS apps and
     * the minimum age required to join.
     */
    ADULT = 0x20,
    /** Another way to refer to a direct-message is a "closed" party. */
    CLOSED = 0x40,
    /** Top 6 bits are a language code */
    LANGUAGE = 0xfc000000,
    /** Combination of all security flags: EMAIL, PHONE, NEW_USER, NEW_MEMBER, MFA_ENABLED */
    SECURITY = 0x1f,
    /** All bitflags of PartyFlags */
    ALL = 0xfc00007f,
}

/** Bit positions for Permissions */
export const enum PermissionsBit {
    /** Grants all permissions. */
    ADMINISTRATOR = 0,
    /** Allows a user to create invites for a party. */
    CREATE_INVITE = 1,
    KICK_MEMBERS = 2,
    BAN_MEMBERS = 3,
    VIEW_AUDIT_LOG = 4,
    VIEW_STATISTICS = 5,
    MANAGE_PARTY = 6,
    MANAGE_ROOMS = 7,
    MANAGE_NICKNAMES = 8,
    MANAGE_ROLES = 9,
    MANAGE_WEBHOOKS = 10,
    /** Allows members to add or remove custom emoji, stickers or sounds. */
    MANAGE_EXPRESSIONS = 11,
    MOVE_MEMBERS = 12,
    CHANGE_NICKNAME = 13,
    MANAGE_PERMS = 14,
    DEFAULT_ONLY = 20,
    VIEW_ROOM = 30,
    READ_MESSAGE_HISTORY = 31,
    SEND_MESSAGES = 32,
    /** Allows a user to manage messages in a room, including reactions. */
    MANAGE_MESSAGES = 33,
    MUTE_MEMBERS = 34,
    DEAFEN_MEMBERS = 35,
    MENTION_EVERYONE = 36,
    USE_EXTERNAL_EMOTES = 37,
    ADD_REACTIONS = 38,
    EMBED_LINKS = 39,
    ATTACH_FILES = 40,
    USE_SLASH_COMMANDS = 41,
    SEND_TTS_MESSAGES = 42,
    /**
     * Allows a user to add new attachments to
     * existing messages using the "edit" API
     */
    EDIT_NEW_ATTACHMENT = 43,
    /** Allows a user to broadcast a stream to this room */
    STREAM = 60,
    /** Allows a user to connect and watch/listen to streams in a room */
    CONNECT = 61,
    /** Allows a user to speak in a room without broadcasting a stream */
    SPEAK = 62,
    /** Allows a user to acquire priority speaker */
    PRIORITY_SPEAKER = 63,
    /** Just something to fit in the top half for now during tests */
    TEST = 127,
}

export const PermissionsBit_DEFAULT = [
    PermissionsBit.CHANGE_NICKNAME, PermissionsBit.VIEW_ROOM, PermissionsBit.READ_MESSAGE_HISTORY, PermissionsBit.SEND_MESSAGES, PermissionsBit.USE_EXTERNAL_EMOTES,
    PermissionsBit.ADD_REACTIONS, PermissionsBit.EMBED_LINKS, PermissionsBit.ATTACH_FILES, PermissionsBit.SEND_TTS_MESSAGES, PermissionsBit.CONNECT,
    PermissionsBit.SPEAK
];

/** All bit positions of Permissions */
export const PermissionsBit_ALL = [
    PermissionsBit.ADMINISTRATOR, PermissionsBit.CREATE_INVITE, PermissionsBit.KICK_MEMBERS, PermissionsBit.BAN_MEMBERS, PermissionsBit.VIEW_AUDIT_LOG,
    PermissionsBit.VIEW_STATISTICS, PermissionsBit.MANAGE_PARTY, PermissionsBit.MANAGE_ROOMS, PermissionsBit.MANAGE_NICKNAMES, PermissionsBit.MANAGE_ROLES,
    PermissionsBit.MANAGE_WEBHOOKS, PermissionsBit.MANAGE_EXPRESSIONS, PermissionsBit.MOVE_MEMBERS, PermissionsBit.CHANGE_NICKNAME, PermissionsBit.MANAGE_PERMS,
    PermissionsBit.DEFAULT_ONLY, PermissionsBit.VIEW_ROOM, PermissionsBit.READ_MESSAGE_HISTORY, PermissionsBit.SEND_MESSAGES, PermissionsBit.MANAGE_MESSAGES,
    PermissionsBit.MUTE_MEMBERS, PermissionsBit.DEAFEN_MEMBERS, PermissionsBit.MENTION_EVERYONE, PermissionsBit.USE_EXTERNAL_EMOTES, PermissionsBit.ADD_REACTIONS,
    PermissionsBit.EMBED_LINKS, PermissionsBit.ATTACH_FILES, PermissionsBit.USE_SLASH_COMMANDS, PermissionsBit.SEND_TTS_MESSAGES, PermissionsBit.EDIT_NEW_ATTACHMENT,
    PermissionsBit.STREAM, PermissionsBit.CONNECT, PermissionsBit.SPEAK, PermissionsBit.PRIORITY_SPEAKER, PermissionsBit.TEST
];

/** Bitflags for RoleFlags */
export const enum RoleFlags {
    HOIST = 0x1,
    MENTIONABLE = 0x2,
    /** All bitflags of RoleFlags */
    ALL = 0x3,
}

export interface Role {
    id: Snowflake,
    party_id: Snowflake,
    avatar?: string,
    name: string,
    desc?: string,
    permissions: RawPermissions,
    color: number | null,
    position: number,
    flags: RoleFlags,
}

export interface EmoteEmoji {
    emoji: string,
}

/** Bitflags for EmoteFlags */
export const enum EmoteFlags {
    ANIMATED = 0x1,
    STICKER = 0x2,
    NSFW = 0x4,
    /** All bitflags of EmoteFlags */
    ALL = 0x7,
}

export interface CustomEmote {
    id: Snowflake,
    party_id: Snowflake,
    asset: Snowflake,
    name: string,
    flags: EmoteFlags,
    aspect_ratio: number,
}

export type Emote = EmoteEmoji | CustomEmote;

/** Bitflags for PinFolderFlags */
export const enum PinFolderFlags {
    COLOR = 0xffffff,
    /** All bitflags of PinFolderFlags */
    ALL = 0xffffff,
}

export interface PinFolder {
    id: Snowflake,
    name: string,
    flags: PinFolderFlags,
    description?: string,
}

export interface PartialParty {
    id: Snowflake,
    /** Party name */
    name: string,
    /** Description of the party, if publicly listed */
    description: string | null,
}

export interface Party extends PartialParty {
    flags: PartyFlags,
    avatar?: string,
    banner?: string | null,
    default_room: Snowflake,
    /** Position of party is user's party list, will be null if not joined */
    position: number | null,
    /** Id of owner user */
    owner: Snowflake,
    roles: Array<Role>,
    emotes: Array<Emote>,
    folders: Array<PinFolder>,
}

/** Bitflags for PartyMemberFlags */
export const enum PartyMemberFlags {
    BANNED = 0x1,
    /** All bitflags of PartyMemberFlags */
    ALL = 0x1,
}

export interface PartyMember {
    user: User,
    /** Will be `None` if no longer in party */
    joined_at: Timestamp | null,
    flags?: PartyMemberFlags,
    /** List of Role id snowflakes, may be excluded from some queries */
    roles?: Array<Snowflake>,
}

export interface ReadyParty {
    party: Party,
    /** The user's own member object */
    me: PartyMember,
}

export const enum RoomKind {
    Text = 0,
    DirectMessage = 1,
    GroupMessage = 2,
    Voice = 3,
    UserForum = 4,
    /** Max value for the enum */
    __MAX,
}

/** Bitflags for RoomFlags */
export const enum RoomFlags {
    KIND = 0xf,
    NSFW = 0x10,
    DEFAULT = 0x20,
    /** All bitflags of RoomFlags */
    ALL = 0x3f,
}

/** Permissions Overwrite for a role or user in a room. */
export interface Overwrite {
    /**
     * Role or User ID
     *
     * If it doesn't exist in the role list, then it's a user, simple as that.
     */
    id: Snowflake,
    /** Permissions to allow. */
    allow?: RawPermissions,
    /** Permissions to deny. */
    deny?: RawPermissions,
}

export interface Room {
    id: Snowflake,
    flags: RoomFlags,
    party_id: Snowflake,
    avatar: string | null,
    name: string,
    topic?: string,
    /** Sort order */
    position: number,
    /** Slow-mode rate limit, in seconds */
    rate_limit_per_user?: number,
    /** Parent room ID for categories */
    parent_id?: Snowflake,
    /** Permission overwrites for this room */
    overwrites?: Array<Overwrite>,
}

export interface Ready {
    user: User,
    /** The parties the user is in, including DMs. */
    parties: Array<ReadyParty>,
    /** Contains all rooms the user is in, including DMs. */
    rooms: Array<Room>,
    /** Gateway session ID, used for resuming sessions */
    session: Snowflake,
}

/** Payload struct for [`ServerMsg::Ready`] */
export type ReadyPayload = Ready;

/**
 * Sent when the session is no longer valid
 *
 * Payload struct for [`ServerMsg::InvalidSession`]
 */
export interface InvalidSessionPayload {
}

/** Payload struct for [`ServerMsg::PartyCreate`] */
export type PartyCreatePayload = Party;

export interface PartyPositionUpdate {
    id: Snowflake,
    position: number,
}

export type PartyUpdateEvent = PartyPositionUpdate | Party;

/** Payload struct for [`ServerMsg::PartyUpdate`] */
export type PartyUpdatePayload = PartyUpdateEvent;

/** Payload struct for [`ServerMsg::PartyDelete`] */
export interface PartyDeletePayload {
    id: Snowflake,
}

/** Payload struct for [`ServerMsg::RoleCreate`] */
export type RoleCreatePayload = Role;

/** Payload struct for [`ServerMsg::RoleUpdate`] */
export type RoleUpdatePayload = Role;

export interface RoleDeleteEvent {
    id: Snowflake,
    party_id: Snowflake,
}

/** Payload struct for [`ServerMsg::RoleDelete`] */
export type RoleDeletePayload = RoleDeleteEvent;

export interface PartyMemberEvent extends PartyMember {
    party_id: Snowflake,
}

/** Payload struct for [`ServerMsg::MemberAdd`] */
export type MemberAddPayload = PartyMemberEvent;

/** Payload struct for [`ServerMsg::MemberUpdate`] */
export type MemberUpdatePayload = PartyMemberEvent;

/** Payload struct for [`ServerMsg::MemberRemove`] */
export type MemberRemovePayload = PartyMemberEvent;

/** Payload struct for [`ServerMsg::MemberBan`] */
export type MemberBanPayload = PartyMemberEvent;

/** Payload struct for [`ServerMsg::MemberUnban`] */
export type MemberUnbanPayload = PartyMemberEvent;

/** Payload struct for [`ServerMsg::RoomCreate`] */
export interface RoomCreatePayload {
}

/** Payload struct for [`ServerMsg::RoomUpdate`] */
export interface RoomUpdatePayload {
}

export interface RoomDeleteEvent {
    id: Snowflake,
    party_id?: Snowflake,
}

/** Payload struct for [`ServerMsg::RoomDelete`] */
export type RoomDeletePayload = RoomDeleteEvent;

/** Payload struct for [`ServerMsg::RoomPinsUpdate`] */
export interface RoomPinsUpdatePayload {
}

export const enum MessageKind {
    Normal = 0,
    Welcome = 1,
    Ephemeral = 2,
    Unavailable = 3,
}

/** Bitflags for MessageFlags */
export const enum MessageFlags {
    /** This message has been deleted */
    DELETED = 0x1,
    /** This messages has been deleted by another user */
    REMOVED = 0x2,
    /** If this message has children */
    PARENT = 0x4,
    MENTIONS_EVERYONE = 0x8,
    MENTIONS_HERE = 0x10,
    TTS = 0x20,
    SUPRESS_EMBEDS = 0x400,
    /** Set if the message has been starred by the user requesting it */
    STARRED = 0x1000,
    /**
     * Top 6 bits are a language code,
     * which is never actually exposed to users.
     */
    LANGUAGE = 0xfc000000,
    /** All bitflags of MessageFlags */
    ALL = 0xfc00143f,
}

export interface EmoteOrEmojiEmote {
    emote: Snowflake,
}

export interface EmoteOrEmojiEmoji {
    emoji: string,
}

/**
 * Simple enum for custom emote ids or emoji symbols
 *
 * When written to URLs in the API (or `Display`ed), emojis become percent encoded, and custom emote ids
 * are prefixed with a colon (`:`)
 */
export type EmoteOrEmoji = EmoteOrEmojiEmote | EmoteOrEmojiEmoji;

export type ReactionShorthand = EmoteOrEmoji & {
    me: boolean,
    count: number,
};

export interface ReactionFull {
    emote: EmoteOrEmoji,
    users: Array<Snowflake>,
}

export type Reaction = ReactionShorthand | ReactionFull;

export interface File {
    id: Snowflake,
    filename: string,
    size: number,
    mime?: string,
    width?: number,
    height?: number,
    /** Base-85 encoded blurhash, basically guaranteed to be larger than 22 bytes so we can't use SmolStr */
    preview?: string,
}

export type Attachment = File;

export enum EmbedType {
    Img = "img",
    Audio = "audio",
    Vid = "vid",
    Html = "html",
    Link = "link",
    Article = "article",
}

/** Bitflags for EmbedFlags */
export const enum EmbedFlags {
    /** This embed contains spoilered content and should be displayed as such */
    SPOILER = 0x1,
    /**
     * This embed may contain content marked as "adult"
     *
     * NOTE: This is not always accurate, and is provided on a best-effort basis
     */
    ADULT = 0x2,
    /** All bitflags of EmbedFlags */
    ALL = 0x3,
}

export interface BasicEmbedMedia {
    u: string,
    /** Non-visible description of the embedded media */
    d?: string,
    /** Cryptographic signature for use with the proxy server */
    s?: string,
    /** height */
    h?: number,
    /** width */
    w?: number,
    m?: string,
}

export interface EmbedMedia extends BasicEmbedMedia {
    a?: Array<BasicEmbedMedia>,
}

export interface EmbedAuthor {
    n: string,
    u?: string,
    i?: EmbedMedia,
}

export interface EmbedProvider {
    n?: string,
    u?: string,
    i?: EmbedMedia,
}

export interface EmbedField {
    n?: string,
    v?: string,
    img?: EmbedMedia,
    /** Should use block-formatting */
    b?: boolean,
}

export interface EmbedFooter {
    t: string,
    i?: EmbedMedia,
}

/**
 * An embed is metadata taken from a given URL by loading said URL, parsing any meta tags, and fetching
 * extra information from oEmbed sources.
 */
export interface EmbedV1 {
    /** Timestamp when the embed was retreived */
    ts: Timestamp,
    /** Embed type */
    ty: EmbedType,
    f?: EmbedFlags,
    /** URL fetched */
    u?: string,
    /** Canonical URL */
    c?: string,
    t?: string,
    /** Description, usually from the Open-Graph API */
    d?: string,
    /** Accent Color */
    ac?: number,
    au?: EmbedAuthor,
    /** oEmbed Provider */
    p?: EmbedProvider,
    /**
     * HTML and similar objects
     *
     * See: <https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/>
     */
    obj?: EmbedMedia,
    img?: EmbedMedia,
    audio?: EmbedMedia,
    vid?: EmbedMedia,
    thumb?: EmbedMedia,
    fields?: Array<EmbedField>,
    footer?: EmbedFooter,
}

export type Embed = { v: "1", } & EmbedV1;

export interface Message {
    id: Snowflake,
    room_id: Snowflake,
    party_id: Snowflake,
    kind?: MessageKind,
    author: PartyMember,
    parent?: Snowflake,
    edited_at?: Timestamp,
    content?: string,
    flags?: MessageFlags,
    pins?: Array<Snowflake>,
    user_mentions?: Array<Snowflake>,
    role_mentions?: Array<Snowflake>,
    room_mentions?: Array<Snowflake>,
    reactions?: Array<Reaction>,
    attachments?: Array<Attachment>,
    embeds?: Array<Embed>,
    score?: number,
}

/** Payload struct for [`ServerMsg::MessageCreate`] */
export type MessageCreatePayload = Message;

/** Payload struct for [`ServerMsg::MessageUpdate`] */
export type MessageUpdatePayload = Message;

export interface MessageDeleteEvent {
    id: Snowflake,
    room_id: Snowflake,
    party_id: Snowflake,
}

/** Payload struct for [`ServerMsg::MessageDelete`] */
export type MessageDeletePayload = MessageDeleteEvent;

export interface UserReactionEvent {
    user_id: Snowflake,
    room_id: Snowflake,
    party_id: Snowflake,
    msg_id: Snowflake,
    member?: PartyMember,
    emote: EmoteOrEmoji,
}

/** Payload struct for [`ServerMsg::MessageReactionAdd`] */
export type MessageReactionAddPayload = UserReactionEvent;

/** Payload struct for [`ServerMsg::MessageReactionRemove`] */
export type MessageReactionRemovePayload = UserReactionEvent;

/** Payload struct for [`ServerMsg::MessageReactionRemoveAll`] */
export interface MessageReactionRemoveAllPayload {
}

/** Payload struct for [`ServerMsg::MessageReactionRemoveEmote`] */
export interface MessageReactionRemoveEmotePayload {
}

export interface UserPresenceEvent {
    party_id?: Snowflake,
    user: User,
}

/** Payload struct for [`ServerMsg::PresenceUpdate`] */
export type PresenceUpdatePayload = UserPresenceEvent;

export interface TypingStart {
    room_id: Snowflake,
    party_id: Snowflake,
    user_id: Snowflake,
    member: PartyMember,
    parent?: Snowflake,
}

/** Payload struct for [`ServerMsg::TypingStart`] */
export type TypingStartPayload = TypingStart;

/** Payload struct for [`ServerMsg::UserUpdate`] */
export interface UserUpdatePayload {
    user: User,
}

export interface ProfileUpdateEvent {
    party_id?: Snowflake,
    user: User,
}

/** Payload struct for [`ServerMsg::ProfileUpdate`] */
export type ProfileUpdatePayload = ProfileUpdateEvent;

export const enum UserRelationship {
    None = 0,
    Friend = 1,
    /** Normal user blocking */
    Blocked = 100,
    /** Blocking + hide messages from the blocked user */
    BlockedDangerous = 101,
}

export interface Relationship {
    note?: string,
    user: User,
    since: Timestamp,
    rel: UserRelationship,
    /** If this relationship is awaiting action from you */
    pending?: boolean,
}

/** Payload struct for [`ServerMsg::RelationAdd`] */
export type RelationAddPayload = Relationship;

/** Payload struct for [`ServerMsg::RelationRemove`] */
export interface RelationRemovePayload {
    user_id: Snowflake,
}

/** Union of all ServerMsg messages */
export type ServerMsg =
    | { o: ServerMsgOpcode.Hello, p: HelloPayload, }
    | { o: ServerMsgOpcode.HeartbeatAck, p: HeartbeatAckPayload, }
    | { o: ServerMsgOpcode.Ready, p: ReadyPayload, }
    | { o: ServerMsgOpcode.InvalidSession, p: InvalidSessionPayload, }
    | { o: ServerMsgOpcode.PartyCreate, p: PartyCreatePayload, }
    | { o: ServerMsgOpcode.PartyUpdate, p: PartyUpdatePayload, }
    | { o: ServerMsgOpcode.PartyDelete, p: PartyDeletePayload, }
    | { o: ServerMsgOpcode.RoleCreate, p: RoleCreatePayload, }
    | { o: ServerMsgOpcode.RoleUpdate, p: RoleUpdatePayload, }
    | { o: ServerMsgOpcode.RoleDelete, p: RoleDeletePayload, }
    | { o: ServerMsgOpcode.MemberAdd, p: MemberAddPayload, }
    | { o: ServerMsgOpcode.MemberUpdate, p: MemberUpdatePayload, }
    | { o: ServerMsgOpcode.MemberRemove, p: MemberRemovePayload, }
    | { o: ServerMsgOpcode.MemberBan, p: MemberBanPayload, }
    | { o: ServerMsgOpcode.MemberUnban, p: MemberUnbanPayload, }
    | { o: ServerMsgOpcode.RoomCreate, p: RoomCreatePayload, }
    | { o: ServerMsgOpcode.RoomUpdate, p: RoomUpdatePayload, }
    | { o: ServerMsgOpcode.RoomDelete, p: RoomDeletePayload, }
    | { o: ServerMsgOpcode.RoomPinsUpdate, p: RoomPinsUpdatePayload, }
    | { o: ServerMsgOpcode.MessageCreate, p: MessageCreatePayload, }
    | { o: ServerMsgOpcode.MessageUpdate, p: MessageUpdatePayload, }
    | { o: ServerMsgOpcode.MessageDelete, p: MessageDeletePayload, }
    | { o: ServerMsgOpcode.MessageReactionAdd, p: MessageReactionAddPayload, }
    | { o: ServerMsgOpcode.MessageReactionRemove, p: MessageReactionRemovePayload, }
    | { o: ServerMsgOpcode.MessageReactionRemoveAll, p: MessageReactionRemoveAllPayload, }
    | { o: ServerMsgOpcode.MessageReactionRemoveEmote, p: MessageReactionRemoveEmotePayload, }
    | { o: ServerMsgOpcode.PresenceUpdate, p: PresenceUpdatePayload, }
    | { o: ServerMsgOpcode.TypingStart, p: TypingStartPayload, }
    | { o: ServerMsgOpcode.UserUpdate, p: UserUpdatePayload, }
    | { o: ServerMsgOpcode.ProfileUpdate, p: ProfileUpdatePayload, }
    | { o: ServerMsgOpcode.RelationAdd, p: RelationAddPayload, }
    | { o: ServerMsgOpcode.RelationRemove, p: RelationRemovePayload, };

/** OpCodes for [`ClientMsg`] */
export const enum ClientMsgOpcode {
    Heartbeat = 0,
    Identify = 1,
    Resume = 2,
    SetPresence = 3,
    Subscribe = 4,
    Unsubscribe = 5,
}

/** Payload struct for [`ClientMsg::Heartbeat`] */
export interface HeartbeatPayload {
}

/** Raw base64-encoded auth tokens for users and bots. */
export type RawAuthToken = string;

/** Bitflags for Intent */
export const enum Intent {
    /**
     * - PARTY_CREATE
     * - PARTY_UPDATE
     * - PARTY_DELETE
     * - PARTY_ROLE_CREATE
     * - PARTY_ROLE_UPDATE
     * - PARTY_ROLE_DELETE
     * - CHANNEL_CREATE
     * - CHANNEL_UPDATE
     * - CHANNEL_DELETE
     * - CHANNEL_PINS_UPDATE
     */
    PARTIES = 0x1,
    /**
     * - PARTY_MEMBER_ADD
     * - PARTY_MEMBER_UPDATE
     * - PARTY_MEMBER_REMOVE
     */
    PARTY_MEMBERS = 0x2,
    /**
     * - PARTY_BAN_ADD
     * - PARTY_BAN_REMOVE
     */
    PARTY_BANS = 0x4,
    /** - PARTY_EMOJIS_UPDATE */
    PARTY_EMOTES = 0x8,
    /**
     * - PARTY_INTEGRATIONS_UPDATE
     * - INTEGRATION_CREATE
     * - INTEGRATION_UPDATE
     * - INTEGRATION_DELETE
     */
    PARTY_INTEGRATIONS = 0x10,
    /** - WEBHOOKS_UPDATE */
    PARTY_WEBHOOKS = 0x20,
    /**
     * - INVITE_CREATE
     * - INVITE_DELETE
     */
    PARTY_INVITES = 0x40,
    /** - VOICE_STATE_UPDATE */
    VOICE_STATUS = 0x80,
    /** - PRESENCE_UPDATE */
    PRESENCE = 0x100,
    /**
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - MESSAGE_DELETE_BULK
     */
    MESSAGES = 0x200,
    /**
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOTE
     */
    MESSAGE_REACTIONS = 0x400,
    /** - TYPING_START */
    MESSAGE_TYPING = 0x800,
    /**
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - CHANNEL_PINS_UPDATE
     */
    DIRECT_MESSAGES = 0x1000,
    /**
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOTE
     */
    DIRECT_MESSAGE_REACTIONS = 0x2000,
    /** - TYPING_START */
    DIRECT_MESSAGE_TYPING = 0x4000,
    PROFILE_UPDATES = 0x8000,
    /** All bitflags of Intent */
    ALL = 0xffff,
}

export interface Identify {
    auth: RawAuthToken,
    intent: Intent,
}

/** Payload struct for [`ClientMsg::Identify`] */
export type IdentifyPayload = Identify;

/** Payload struct for [`ClientMsg::Resume`] */
export interface ResumePayload {
    session: Snowflake,
}

export type SetPresence = UserPresence;

/** Payload struct for [`ClientMsg::SetPresence`] */
export type SetPresencePayload = SetPresence;

/** Payload struct for [`ClientMsg::Subscribe`] */
export interface SubscribePayload {
    party_id: Snowflake,
}

/** Payload struct for [`ClientMsg::Unsubscribe`] */
export interface UnsubscribePayload {
    party_id: Snowflake,
}

/** Union of all ClientMsg messages */
export type ClientMsg =
    | { o: ClientMsgOpcode.Heartbeat, p: HeartbeatPayload, }
    | { o: ClientMsgOpcode.Identify, p: IdentifyPayload, }
    | { o: ClientMsgOpcode.Resume, p: ResumePayload, }
    | { o: ClientMsgOpcode.SetPresence, p: SetPresencePayload, }
    | { o: ClientMsgOpcode.Subscribe, p: SubscribePayload, }
    | { o: ClientMsgOpcode.Unsubscribe, p: UnsubscribePayload, };

/** Standard API error codes. */
export enum ApiErrorCode {
    DbError = 50001,
    JoinError = 50002,
    SemaphoreError = 50003,
    HashError = 50004,
    JsonError = 50005,
    EventEncodingError = 50006,
    InternalError = 50007,
    Utf8ParseError = 50008,
    IOError = 50009,
    InvalidHeaderValue = 50010,
    XMLError = 50011,
    RequestError = 50012,
    Unimplemented = 50013,
    BincodeError = 50014,
    CborError = 50015,
    RkyvEncodingError = 50016,
    RpcClientError = 50017,
    AlreadyExists = 40001,
    UsernameUnavailable = 40002,
    InvalidEmail = 40003,
    InvalidUsername = 40004,
    InvalidPassword = 40005,
    InvalidCredentials = 40006,
    InsufficientAge = 40007,
    InvalidDate = 40008,
    InvalidContent = 40009,
    InvalidName = 40010,
    InvalidTopic = 40011,
    MissingUploadMetadataHeader = 40012,
    MissingAuthorizationHeader = 40013,
    NoSession = 40014,
    InvalidAuthFormat = 40015,
    HeaderParseError = 40016,
    MissingFilename = 40017,
    MissingMime = 40018,
    AuthTokenError = 40019,
    Base64DecodeError = 40020,
    BodyDeserializeError = 40021,
    QueryParseError = 40022,
    UploadError = 40023,
    InvalidPreview = 40024,
    MimeParseError = 40025,
    InvalidImageFormat = 40026,
    TOTPRequired = 40027,
    InvalidPreferences = 40028,
    TemporarilyDisabled = 40029,
    InvalidCaptcha = 40030,
    Base85DecodeError = 40031,
    WebsocketError = 40032,
    MissingContentTypeHeader = 40033,
    Blocked = 40034,
    Banned = 40035,
    SearchError = 40036,
    IncorrectRpcEndpoint = 40047,
    BadRequest = 40400,
    Unauthorized = 40401,
    NotFound = 40404,
    MethodNotAllowed = 40405,
    RequestTimeout = 40408,
    Conflict = 40409,
    RequestEntityTooLarge = 40413,
    UnsupportedMediaType = 40415,
    ChecksumMismatch = 40460,
    Unknown = 1,
}

/** Standard API error response, containing an error code and message. */
export interface RawApiError {
    /** Error code */
    code: ApiErrorCode,
    /** Human-readable error message */
    message: string,
}

/** Bitflags for CommandFlags */
export const enum CommandFlags {
    /** Command requires authorization to execute. */
    AUTHORIZED = 0x1,
    /** Command has a request body. */
    HAS_BODY = 0x2,
    HAS_RESPONSE = 0x4,
    STREAMING = 0x8,
    BOTS_ONLY = 0x20,
    USERS_ONLY = 0x40,
    ADMIN_ONLY = 0x80,
    /** All bitflags of CommandFlags */
    ALL = 0xef,
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

export interface ServerConfig {
    hcaptcha_sitekey: string,
    /** CDN Domain */
    cdn: string,
    /** Minimum user age (in years) */
    min_age: number,
    /** If the serve should require HTTPS */
    secure: boolean,
    limits: ServerLimits,
    /** If true, use a "camo"/camouflage route provided at "{cdn}/camo/base64_url/url_signature" */
    camo: boolean,
}

/** Gets the global server configuration */
export const GetServerConfig = /*#__PURE__*/command.get<{}, ServerConfig, null>({
    path: "/config",
    flags: CommandFlags.HAS_RESPONSE,
});

export interface BuildInfo {
    server: string,
    target: string,
    debug: boolean,
    time: string,
}

/**
 * Retrieves the build information of the server node. This is useful for debugging and
 * reporting issues. This may not be consistent across all nodes or invocations.
 */
export const GetBuildInfo = /*#__PURE__*/command.get<{}, BuildInfo, null>({
    path: "/build_info",
    flags: CommandFlags.HAS_RESPONSE,
});

export interface CreateFileBody {
    filename: string,
    size: number,
    mime?: string,
    width?: number,
    height?: number,
    preview?: string,
}

export const CreateFile = /*#__PURE__*/command.post<{ body: CreateFileBody, }, Snowflake, CreateFileBody>({
    path: "/file",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export interface FilesystemStatus {
    quota_used: number,
    quota_total: number,
}

export const GetFilesystemStatus = /*#__PURE__*/command.options<{}, FilesystemStatus, null>({
    path: "/file",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export interface FileStatus {
    complete: number,
    upload_offset: number,
}

export const GetFileStatus = /*#__PURE__*/command.head<{ file_id: Snowflake, }, FileStatus, null>({
    path() { return `/file/${this.file_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export const GetParty = /*#__PURE__*/command.get<{ party_id: Snowflake, }, Party, null>({
    path() { return `/party/${this.party_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export interface CreatePartyForm {
    name: string,
    description?: string,
    flags: PartyFlags,
}

export const CreateParty = /*#__PURE__*/command.post<{ body: CreatePartyForm, }, Party, CreatePartyForm>({
    path: "/party",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const enum BannerAlign {
    Top,
    Middle,
    Bottom,
}

export interface PatchPartyForm {
    name?: string,
    description?: string | null,
    flags?: PartyFlags,
    default_room?: Snowflake,
    avatar?: Snowflake | null,
    banner?: Snowflake | null,
    banner_align?: BannerAlign,
}

export const PatchParty = /*#__PURE__*/command.patch<{ party_id: Snowflake, body: PatchPartyForm, }, Party, PatchPartyForm>({
    path() { return `/party/${this.party_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const DeleteParty = /*#__PURE__*/command.delete<{ party_id: Snowflake, }, null, null>({
    path() { return `/party/${this.party_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.USERS_ONLY,
});

/**
 * Transfer ownership of a party to another user.
 *
 * This command is only available to the current owner, or the person who is accepting ownership.
 *
 * Confirming ownership is done by the accepting user also sending a `TransferOwnership`
 * command with the same parameters.
 */
export const TransferOwnership = /*#__PURE__*/command.put<{ party_id: Snowflake, user_id: Snowflake, }, null, null>({
    path() { return `/party/${this.party_id}/owner/${this.user_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.USERS_ONLY,
});

export interface CreateRoleForm {
    name: string,
}

export const CreateRole = /*#__PURE__*/command.post<{ party_id: Snowflake, body: CreateRoleForm, }, Role, CreateRoleForm>({
    path() { return `/party/${this.party_id}/roles`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export interface PatchRoleForm {
    flags?: RoleFlags,
    name?: string,
    color?: number,
    permissions?: RawPermissions,
    avatar?: Snowflake | null,
    position?: number,
}

export const PatchRole = /*#__PURE__*/command.patch<{ party_id: Snowflake, role_id: Snowflake, body: PatchRoleForm, }, Role, PatchRoleForm>({
    path() { return `/party/${this.party_id}/roles/${this.role_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const DeleteRole = /*#__PURE__*/command.delete<{ party_id: Snowflake, role_id: Snowflake, }, null, null>({
    path() { return `/party/${this.party_id}/roles/${this.role_id}`; },
    flags: CommandFlags.AUTHORIZED,
});

export const GetPartyMembers = /*#__PURE__*/command.get<{ party_id: Snowflake, }, PartyMember, null>({
    path() { return `/party/${this.party_id}/members`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING,
});

export const GetPartyMember = /*#__PURE__*/command.get<{ party_id: Snowflake, member_id: Snowflake, }, PartyMember, null>({
    path() { return `/party/${this.party_id}/member/${this.member_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export const GetPartyRooms = /*#__PURE__*/command.get<{ party_id: Snowflake, }, Room, null>({
    path() { return `/party/${this.party_id}/rooms`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING,
});

export interface Invite {
    /** Invite code, which is either an encrypted Snowflake or a custom vanity code. */
    code: string,
    party: PartialParty,
    inviter?: Snowflake,
    description?: string,
    expires: Timestamp | null,
    /**
     * Number of remaining uses this invite has left.
     *
     * Only users with the `MANAGE_INVITES` permission can see this.
     */
    remaining?: number,
}

export const GetPartyInvites = /*#__PURE__*/command.get<{ party_id: Snowflake, }, Invite, null>({
    path() { return `/party/${this.party_id}/invites`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING,
});

export const GetMemberProfile = /*#__PURE__*/command.get<{ party_id: Snowflake, user_id: Snowflake, }, UserProfile, null>({
    path() { return `/party/${this.party_id}/members/${this.user_id}/profile`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export interface UpdateUserProfileBody {
    bits: UserProfileBits,
    extra?: ExtraUserProfileBits,
    nick?: string | null,
    avatar?: Snowflake | null,
    banner?: Snowflake | null,
    banner_align?: BannerAlign,
    status?: string | null,
    bio?: string | null,
}

export type UpdateMemberProfileBody = UpdateUserProfileBody;

export const UpdateMemberProfile = /*#__PURE__*/command.patch<{ party_id: Snowflake, body: UpdateMemberProfileBody, }, UserProfile, UpdateMemberProfileBody>({
    path() { return `/party/${this.party_id}/members/profile`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

/** Infinite parameters may only be used with appropriate permissions */
export interface CreatePartyInviteBody {
    /** If `None`, invite has infinite uses */
    max_uses?: number,
    /** If `None`, invite has infinite duration */
    duration?: number,
    description?: string,
}

export const CreatePartyInvite = /*#__PURE__*/command.post<{ party_id: Snowflake, body: CreatePartyInviteBody, }, Invite, CreatePartyInviteBody>({
    path() { return `/party/${this.party_id}/invites`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export interface CreatePinFolderForm {
    name: string,
    description?: string,
}

export const CreatePinFolder = /*#__PURE__*/command.post<{ party_id: Snowflake, body: CreatePinFolderForm, }, PinFolder, CreatePinFolderForm>({
    path() { return `/party/${this.party_id}/pins`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const enum CreateRoomKind {
    Text,
    Voice,
    UserForum,
}

export interface CreateRoomForm {
    name: string,
    topic?: string,
    kind: CreateRoomKind,
    overwrites?: Array<Overwrite>,
    position: number,
}

export const CreateRoom = /*#__PURE__*/command.post<{ party_id: Snowflake, body: CreateRoomForm, }, Room, CreateRoomForm>({
    path() { return `/party/${this.party_id}/rooms`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export interface SearchQuery {
    query: string,
}

export const SearchParty = /*#__PURE__*/command.post<{ party_id: Snowflake, body: SearchQuery, }, null, SearchQuery>({
    path() { return `/party/${this.party_id}/search`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY,
});

export interface CreateMessageBody {
    content: string,
    parent?: Snowflake,
    attachments?: Array<Snowflake>,
    embeds?: Array<Embed>,
    ephemeral?: boolean,
    tts?: boolean,
}

/** Create message command */
export const CreateMessage = /*#__PURE__*/command.post<{ room_id: Snowflake, body: CreateMessageBody, }, Message, CreateMessageBody>({
    path() { return `/room/${this.room_id}/messages`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export interface EditMessageBody {
    content: string,
    attachments?: Array<Snowflake>,
}

export const EditMessage = /*#__PURE__*/command.patch<{ room_id: Snowflake, msg_id: Snowflake, body: EditMessageBody, }, Message, EditMessageBody>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const DeleteMessage = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
    flags: CommandFlags.AUTHORIZED,
});

export const GetMessage = /*#__PURE__*/command.get<{ room_id: Snowflake, msg_id: Snowflake, }, Message, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export interface StartTypingBody {
    /** Will only show within the parent context if set */
    parent?: Snowflake,
}

export const StartTyping = /*#__PURE__*/command.post<{ room_id: Snowflake, body: StartTypingBody, }, null, StartTypingBody>({
    path() { return `/room/${this.room_id}/typing`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY,
});

/**
 * Directional search query
 *
 * Used for paginated queries to determine the direction of the search, where
 * "after" is ascending and "before" is descending, starting from the given ID.
 */
export type Cursor =
    | { exact: Snowflake, }
    | { after: Snowflake, }
    | { before: Snowflake, };

export type GetMessagesQuery = Partial<Cursor> & {
    parent?: Snowflake,
    limit?: number,
    pinned?: Array<Snowflake>,
    /** If true, return only messages in the channel which have been starred by us */
    starred?: boolean,
    /**
     * If above zero, this will also fetch child messages of messages
     *
     * Max level is 5
     *
     * Child messages will not obey other filtering criteria.
     */
    recurse?: number,
};

export const GetMessages = /*#__PURE__*/command.get<{ room_id: Snowflake, body: GetMessagesQuery, }, Message, GetMessagesQuery>({
    path() { return `/room/${this.room_id}/messages`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING,
});

export const PinMessage = /*#__PURE__*/command.put<{ room_id: Snowflake, msg_id: Snowflake, pin_tag: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/pins/${this.pin_tag}`; },
    flags: CommandFlags.AUTHORIZED,
});

export const UnpinMessage = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, pin_tag: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/pins/${this.pin_tag}`; },
    flags: CommandFlags.AUTHORIZED,
});

export const StarMessage = /*#__PURE__*/command.put<{ room_id: Snowflake, msg_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/star`; },
    flags: CommandFlags.AUTHORIZED,
});

export const UnstarMessage = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/star`; },
    flags: CommandFlags.AUTHORIZED,
});

export const PutReaction = /*#__PURE__*/command.put<{ room_id: Snowflake, msg_id: Snowflake, emote_id: EmoteOrEmoji, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${this.emote_id}/@me`; },
    flags: CommandFlags.AUTHORIZED,
});

export const DeleteOwnReaction = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, emote_id: EmoteOrEmoji, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${this.emote_id}/@me`; },
    flags: CommandFlags.AUTHORIZED,
});

export const DeleteUserReaction = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, emote_id: EmoteOrEmoji, user_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${this.emote_id}/${this.user_id}`; },
    flags: CommandFlags.AUTHORIZED,
});

export const DeleteAllReactions = /*#__PURE__*/command.delete<{ room_id: Snowflake, msg_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions`; },
    flags: CommandFlags.AUTHORIZED,
});

export interface GetReactionsForm {
    after?: Snowflake,
    limit?: number,
}

export const GetReactions = /*#__PURE__*/command.get<{ room_id: Snowflake, msg_id: Snowflake, emote_id: EmoteOrEmoji, body: GetReactionsForm, }, null, GetReactionsForm>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${this.emote_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.STREAMING,
});

export interface FullRoom extends Room {
    perms: RawPermissions,
}

export const GetRoom = /*#__PURE__*/command.get<{ room_id: Snowflake, }, FullRoom, null>({
    path() { return `/room/${this.room_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

/** `Nullable::Undefined` or `Option::None` fields indicate no change */
export interface PatchRoomForm {
    name?: string,
    topic?: string | null,
    avatar?: Snowflake | null,
    position?: number,
    remove_overwrites?: Array<Snowflake>,
    overwrites?: Array<Overwrite>,
    nsfw?: boolean,
}

export const PatchRoom = /*#__PURE__*/command.patch<{ room_id: Snowflake, body: PatchRoomForm, }, FullRoom, PatchRoomForm>({
    path() { return `/room/${this.room_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

export const DeleteRoom = /*#__PURE__*/command.delete<{ room_id: Snowflake, }, null, null>({
    path() { return `/room/${this.room_id}`; },
    flags: CommandFlags.AUTHORIZED,
});

export interface UserRegisterForm {
    /** Email address */
    email: string,
    /** Username */
    username: string,
    /** Password (Plaintext, will be hashed on the server) */
    password: string,
    /** Date of birth */
    dob: Timestamp,
    /** hCaptcha token */
    token: string,
}

export interface Session {
    /** Auth token encoded as base-64 */
    auth: RawAuthToken,
    /** Expiration timestamp encoded with RFC 3339 */
    expires: Timestamp,
}

export const UserRegister = /*#__PURE__*/command.post<{ body: UserRegisterForm, }, Session, UserRegisterForm>({
    path: "/user",
    flags: CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE | CommandFlags.USERS_ONLY,
});

export interface UserLoginForm {
    /** Email address */
    email: string,
    /** Password (Plaintext, will be hashed on the server) */
    password: string,
    /** 2FA token, if enabled */
    totp?: string,
}

export const UserLogin = /*#__PURE__*/command.post<{ body: UserLoginForm, }, Session, UserLoginForm>({
    path: "/user/@me",
    flags: CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE | CommandFlags.USERS_ONLY,
});

export const UserLogout = /*#__PURE__*/command.delete<{}, null, null>({
    path: "/user/@me",
    flags: CommandFlags.AUTHORIZED | CommandFlags.USERS_ONLY,
});

export interface Enable2FAForm {
    /** Password */
    password: string,
    token: string,
}

export interface Added2FA {
    /** URL to be displayed as a QR code and added to an authenticator app */
    url: string,
    /** Backup codes to be stored in a safe place */
    backup: Array<string>,
}

export const Enable2FA = /*#__PURE__*/command.post<{ body: Enable2FAForm, }, Added2FA, Enable2FAForm>({
    path: "/user/@me/2fa",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE | CommandFlags.USERS_ONLY,
});

export interface Confirm2FAForm {
    password: string,
    totp: string,
}

export const Confirm2FA = /*#__PURE__*/command.patch<{ body: Confirm2FAForm, }, null, Confirm2FAForm>({
    path: "/user/@me/2fa",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.USERS_ONLY,
});

export interface Remove2FAForm {
    password: string,
    totp: string,
}

export const Remove2FA = /*#__PURE__*/command.delete<{ body: Remove2FAForm, }, null, Remove2FAForm>({
    path: "/user/@me/2fa",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.USERS_ONLY,
});

export interface ChangePasswordForm {
    /** Current password */
    current: string,
    /** New password */
    new: string,
    /** 2FA token, if enabled */
    totp?: string,
}

export const ChangePassword = /*#__PURE__*/command.patch<{ body: ChangePasswordForm, }, null, ChangePasswordForm>({
    path: "/user/@me/password",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.USERS_ONLY,
});

export interface AnonymousSession {
    /** Expiration timestamp encoded with RFC 3339/ISO 8061 */
    expires: Timestamp,
}

export const GetSessions = /*#__PURE__*/command.get<{}, AnonymousSession, null>({
    path: "/user/@me/sessions",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING | CommandFlags.USERS_ONLY,
});

export interface ClearSessionsForm {
    totp?: string,
}

/** Clears all **other** sessions */
export const ClearSessions = /*#__PURE__*/command.delete<{ body: ClearSessionsForm, }, null, ClearSessionsForm>({
    path: "/user/@me/sessions",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.USERS_ONLY,
});

export const GetRelationships = /*#__PURE__*/command.get<{}, Relationship, null>({
    path: "/user/@me/relationships",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE | CommandFlags.STREAMING | CommandFlags.USERS_ONLY,
});

export interface PatchRelationshipBody {
    /** Your desired relationship with the other user */
    rel?: UserRelationship | null,
    /** Optional note to give the user */
    note?: string | null,
}

export const PatchRelationship = /*#__PURE__*/command.patch<{ user_id: Snowflake, body: PatchRelationshipBody, }, Relationship, PatchRelationshipBody>({
    path() { return `/user/@me/relationships/${this.user_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE | CommandFlags.USERS_ONLY,
});

export const UpdateUserProfile = /*#__PURE__*/command.patch<{ body: UpdateUserProfileBody, }, UserProfile, UpdateUserProfileBody>({
    path: "/user/@me/profile",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.HAS_RESPONSE,
});

/** Fetches full user information, including profile data */
export const GetUser = /*#__PURE__*/command.get<{ user_id: Snowflake, }, User, null>({
    path() { return `/user/${this.user_id}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export type UpdateUserPrefsBody = UserPreferences;

export const UpdateUserPrefs = /*#__PURE__*/command.patch<{ body: UpdateUserPrefsBody, }, null, UpdateUserPrefsBody>({
    path: "/user/@me/prefs",
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY | CommandFlags.USERS_ONLY,
});

export const GetInvite = /*#__PURE__*/command.get<{ code: string, }, Invite, null>({
    path() { return `/invite/${this.code}`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_RESPONSE,
});

export const RevokeInvite = /*#__PURE__*/command.delete<{ code: string, }, null, null>({
    path() { return `/invite/${this.code}`; },
    flags: CommandFlags.AUTHORIZED,
});

export interface RedeemInviteBody {
    nickname?: string,
}

export const RedeemInvite = /*#__PURE__*/command.post<{ code: string, body: RedeemInviteBody, }, null, RedeemInviteBody>({
    path() { return `/invite/${this.code}/redeem`; },
    flags: CommandFlags.AUTHORIZED | CommandFlags.HAS_BODY,
});