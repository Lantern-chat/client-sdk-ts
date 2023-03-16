import type { Role, Snowflake } from "../models";

export type RawPermissions = string | number; // bigint

export type IntoPermissions = PermissionBit | Permissions;

export enum PermissionBit {
    ADMINISTRATOR /*      */ = 0,
    CREATE_INVITE /*      */ = 1,
    KICK_MEMBERS /*       */ = 2,
    BAN_MEMBERS /*        */ = 3,
    VIEW_AUDIT_LOG /*     */ = 4,
    VIEW_STATISTICS /*    */ = 5,
    MANAGE_PARTY /*       */ = 6,
    MANAGE_ROOMS /*       */ = 7,
    MANAGE_NICKNAMES /*   */ = 8,
    MANAGE_ROLES /*       */ = 9,
    MANAGE_WEBHOOKS /*    */ = 10,
    MANAGE_EMOJIS /*      */ = 11,
    MOVE_MEMBERS /*       */ = 12,
    CHANGE_NICKNAME /*    */ = 13,
    MANAGE_PERMS /*       */ = 14,

    VIEW_ROOM /*          */ = 30,
    READ_MESSAGE_HISTORY/**/ = 31,
    SEND_MESSAGES /*      */ = 32,
    MANAGE_MESSAGES /*    */ = 33,
    MUTE_MEMBERS /*       */ = 34,
    DEAFEN_MEMBERS /*     */ = 35,
    MENTION_EVERYONE /*   */ = 36,
    USE_EXTERNAL_EMOTES /**/ = 37,
    ADD_REACTIONS /*      */ = 38,
    EMBED_LINKS /*        */ = 39,
    ATTACH_FILES /*       */ = 40,
    USE_SLASH_COMMANDS /* */ = 41,
    SEND_TTS_MESSAGES /*  */ = 42,
    /// Allows a user to add new attachments to
    /// existing messages using the "edit" API
    EDIT_NEW_ATTACHMENT /**/ = 43,

    /// Allows a user to broadcast a stream to this room
    STREAM /*             */ = 60,
    /// Allows a user to connect and watch/listen to streams in a room
    CONNECT /*            */ = 61,
    /// Allows a user to speak in a room without broadcasting a stream
    SPEAK /*              */ = 62,
    /// Allows a user to acquire priority speaker
    PRIORITY_SPEAKER /*   */ = 63,
}


const ONE: bigint = BigInt(1);
function into(perms: IntoPermissions): bigint {
    return perms instanceof Permissions ? perms.p : (ONE << BigInt(perms));
}

export class Permissions {
    p: bigint;

    constructor(raw: RawPermissions | Permissions | bigint = '0') {
        this.p = raw instanceof Permissions ? raw.p : BigInt(raw);
    }

    /// Crates a new Permissions object with the same flags
    clone() {
        return new Permissions(this.p);
    }

    raw(): bigint {
        return this.p;
    }

    has(ip: IntoPermissions): boolean {
        let p = into(ip);
        return (this.p & p) == p;
    }

    is_admin(): boolean {
        return this.has(PermissionBit.ADMINISTRATOR);
    }

    /// Mutates the current Permissions object to add the given permissions
    add(...perms: IntoPermissions[]): Permissions {
        this.p = perms.reduce((perms: bigint, perm: IntoPermissions) => perms | into(perm), this.p);
        return this;
    }

    /// Mutates the current Permissions object to remove the given permissions
    sub(...perms: IntoPermissions[]): Permissions {
        this.p = perms.reduce((perms: bigint, perm: IntoPermissions) => perms & ~into(perm), this.p);
        return this;
    }

    /// Combines permission flags into a new Permissions object
    union(...perms: IntoPermissions[]): Permissions {
        return this.clone().add(...perms);
    }

    /// Subtracts permissions flags into a new Permissions object
    diff(...perms: IntoPermissions[]): Permissions {
        return this.clone().sub(...perms);
    }

    static union(...perms: IntoPermissions[]): Permissions {
        return Permissions.EMPTY.union(...perms);
    }

    static EMPTY: Permissions = new Permissions();
    static ALL: Permissions = new Permissions().add(...Object.values(PermissionBit).filter(b => typeof b === 'number') as PermissionBit[]);

    toJSON(): string {
        return this.p.toString();
    }

    static compute_base(roles: Role[]): Permissions {
        // optimized loop, aside from the bigint parsing
        let p = roles.reduce((perms, role) => (perms.p |= BigInt(role.permissions), perms), new Permissions());
        return p.is_admin() ? Permissions.ALL : p;
    }

    compute_overwrites(overwrites: Overwrite[], roles: Snowflake[], user_id: Snowflake): Permissions {
        if(this.is_admin()) {
            return Permissions.ALL;
        }

        let base = this.clone(), allow = new Permissions(), deny = allow.clone(), user_overwrite;

        // overwrites are always sorted role-first
        for(let overwrite of overwrites) {
            if(roles.indexOf(overwrite.id) != -1) {
                if(overwrite.deny) {
                    deny.add(overwrite.deny);
                }
                if(overwrite.allow) {
                    allow.add(overwrite.allow);
                }
            } else if(overwrite.id == user_id) {
                user_overwrite = overwrite;
                break;
            }
        }

        base.sub(deny).add(allow);

        if(user_overwrite) {
            if(user_overwrite.deny) {
                base.sub(user_overwrite.deny);
            }
            if(user_overwrite.allow) {
                base.add(user_overwrite.allow);
            }
        }

        return base;
    }
}

export interface RawOverwrite {
    id: Snowflake,
    allow?: RawPermissions,
    deny?: RawPermissions,
}

export interface Overwrite {
    id: Snowflake,
    allow?: Permissions,
    deny?: Permissions,
}
