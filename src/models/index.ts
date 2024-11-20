/** Exported const values */
export {
    ElevationLevel, UserFlags, UserProfileBits, ExtraUserProfileBits, Locale,
    UserPrefsFlags, FriendAddability, Font, UserPresenceFlags, PartyFlags,
    PermissionsBit, PermissionsBit_DEFAULT, PermissionsBit_ALL, RoleFlags, EmoteFlags,
    PinFolderFlags, PartyMemberFlags, RoomKind, RoomFlags, MessageKind,
    MessageFlags, EmbedType, EmbedFlags, UserRelationship
} from '../autogenerated';

/** Exported types */
export type {
    UserProfile, Temperature, FontSize, Padding, TabSize,
    UserPreferences, Activity, AnyActivity, UserPresence, User,
    Role, EmoteEmoji, CustomEmote, Emote, PinFolder,
    PartialParty, Party, PartyMember, Overwrite, Room,
    EmoteOrEmojiEmote, EmoteOrEmojiEmoji, EmoteOrEmoji, ReactionShorthand, ReactionFull,
    Reaction, File, Attachment, BasicEmbedMedia, EmbedMedia,
    EmbedAuthor, EmbedProvider, EmbedField, EmbedFooter, EmbedV1,
    Embed, Message, Relationship, RawAuthToken, ServerLimits,
    ServerConfig, Invite, Cursor, FullRoom, Session,
    AnonymousSession
} from '../autogenerated';

import { ElevationLevel, Font, RoomFlags, RoomKind, UserFlags, UserPrefsFlags, UserPresenceFlags } from "../autogenerated";
import type { User, UserPreferences, UserPresence, UserProfile } from "../autogenerated";

export { AuthToken } from "./auth";
export * as auth from "./auth";

export type { RawPermissions } from "./permission";
export * as perms from "./permission";

/** Snowflakes cannot be 0/"0" */
export type Snowflake = Exclude<string, "0" | 0>;

export const LANTERN_EPOCH = 1550102400000; // 2019-02-14T00:00:00.000Z

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

/**
 * Unpacked values from UserProfile.bits
 */
export interface UserProfileSplitBits {
    roundedness: number,
    override_color: boolean,
    color: number,
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

export function parse_user_elevation(user: User): ElevationLevel | undefined {
    let flags = (user.flags & UserFlags.ELEVATION) >> 6;
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

export const FONT_NAMES: { [key in keyof typeof Font]: string } = {
    "SansSerif": "Sans Serif",
    "Serif": "Serif",
    "Monospace": "Monospace",
    "Cursive": "Cursive",
    "ComicSans": "Comis Sans",
    "OpenDyslexic": "Open Dyslexic",
    "AtkinsonHyperlegible": "Atkinson Hyperlegible",
};

export function hasUserPrefFlag(prefs: Pick<UserPreferences, 'f'>, flag: UserPrefsFlags): boolean {
    return ((prefs.f! | 0) & flag) !== 0;
}

export function room_kind(flags: RoomFlags & number): RoomKind {
    let bits = flags & 0xF;
    return bits < RoomKind.__MAX ? bits as RoomKind : RoomKind.Text;
}

export const enum PresenceStatus {
    Online,
    Away,
    Busy,
    Offline,
}

export function parse_presence(p?: UserPresence): { status: PresenceStatus, is_mobile: boolean; } {
    let status = PresenceStatus.Offline, is_mobile = false;

    if(p) {
        if(p.flags & UserPresenceFlags.ONLINE) status = PresenceStatus.Online;
        else if(p.flags & UserPresenceFlags.AWAY) status = PresenceStatus.Away;
        else if(p.flags & UserPresenceFlags.BUSY) status = PresenceStatus.Busy;
        is_mobile = (p.flags & UserPresenceFlags.MOBILE) != 0;
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