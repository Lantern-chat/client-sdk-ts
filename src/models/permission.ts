import type { Snowflake } from "../models";

export interface Permission {
    party: number,
    room: number,
    stream: number,
}

export interface Overwrite {
    id: Snowflake,
    allow?: Permission,
    deny?: Permission,
}

export const enum PartyPermissions {
    CREATE_INVITE = 1 << 0,
    KICK_MEMBERS = 1 << 1,
    BAN_MEMBERS = 1 << 2,
    ADMINISTRATOR = 1 << 3,
    VIEW_AUDIT_LOG = 1 << 4,
    VIEW_STATISTICS = 1 << 5,
    MANAGE_PARTY = 1 << 6,
    MANAGE_ROOMS = 1 << 7,
    MANAGE_NICKNAMES = 1 << 8,
    MANAGE_ROLES = 1 << 9,
    MANAGE_WEBHOOKS = 1 << 10,
    MANAGE_EMOJIS = 1 << 11,
    MOVE_MEMBERS = 1 << 12,
    CHANGE_NICKNAME = 1 << 13,
    MANAGE_PERMS = 1 << 14,

    PARTY_ALL = (1 << 15) - 1,
}

export const enum RoomPermissions {
    VIEW_ROOM = 1 << 0,
    READ_MESSAGES = 1 << 1 | VIEW_ROOM,
    SEND_MESSAGES = 1 << 2 | VIEW_ROOM,
    MANAGE_MESSAGES = 1 << 3,
    MUTE_MEMBERS = 1 << 4,
    DEAFEN_MEMBERS = 1 << 5,
    MENTION_EVERYONE = 1 << 6,
    USE_EXTERNAL_EMOTES = 1 << 7,
    ADD_REACTIONS = 1 << 8,
    EMBED_LINKS = 1 << 9,
    ATTACH_FILES = 1 << 10,
    USE_SLASH_COMMANDS = 1 << 11,
    SEND_TTS_MESSAGES = 1 << 12,
    EDIT_NEW_ATTACHMENT = 1 << 13,

    ROOM_ALL = (1 << 14) - 1,
}

export const enum StreamPermissions {
    /// Allows a user to broadcast a stream to this room
    STREAM = 1 << 0,
    /// Allows a user to connect and watch/listen to streams in a room
    CONNECT = 1 << 1,
    /// Allows a user to speak in a room without broadcasting a stream
    SPEAK = 1 << 2,
    /// Allows a user to acquire priority speaker
    PRIORITY_SPEAKER = 1 << 3,

    STREAM_ALL = (1 << 4) - 1,
}

export function union(...perms: Array<Partial<Permission>>): Permission {
    let result = { party: 0, room: 0, stream: 0 };

    for(let perm of perms) {
        result.party |= perm.party!;
        result.room |= perm.room!;
        result.stream |= perm.stream!;
    }

    return result;
}

export const EMPTY: Permission = union();

export function difference(a: Permission, b: Permission): Permission {
    return {
        party: a.party & ~b.party,
        room: a.room & ~b.room,
        stream: a.stream & ~b.stream,
    }
}

export function cond(value: boolean, p: Partial<Permission>): Partial<Permission> {
    return value ? union(p) : EMPTY;
}

export function compute_overwrites(
    base: Permission,
    overwrites: Overwrite[],
    roles: Snowflake[],
    user_id: Snowflake,
): Permission {
    let allow = union(),
        deny = union(),
        user_overwrite;

    // overwrites are always sorted role-first
    for(let overwrite of overwrites) {
        if(roles.indexOf(overwrite.id) != -1) {
            if(overwrite.deny) {
                deny = union(deny, overwrite.deny);
            }
            if(overwrite.allow) {
                allow = union(allow, overwrite.allow);
            }
        } else if(overwrite.id == user_id) {
            user_overwrite = overwrite;
            break;
        }
    }

    base = difference(base, deny);
    base = union(base, allow);

    if(user_overwrite) {
        if(user_overwrite.deny) {
            base = difference(base, user_overwrite.deny);
        }

        if(user_overwrite.allow) {
            base = union(base, user_overwrite.allow);
        }
    }

    return base;
}