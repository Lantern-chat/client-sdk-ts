import type { Snowflake, User, Room, Party, PartyMember, Message, Role, UserPresence, EmoteOrEmoji, Friend } from "../models";

export const enum Intent {
    PARTIES = 1 << 0,
    PARTY_MEMBERS = 1 << 1,
    PARTY_BANS = 1 << 2,
    PARTY_EMOTES = 1 << 3,
    PARTY_INTEGRATIONS = 1 << 4,
    PARTY_WEBHOOKS = 1 << 5,
    PARTY_INVITES = 1 << 6,
    VOICE_STATUS = 1 << 7,
    PRESENCE = 1 << 8,
    MESSAGES = 1 << 9,
    MESSAGE_REACTIONS = 1 << 10,
    MESSAGE_TYPING = 1 << 11,
    DIRECT_MESSAGES = 1 << 12,
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    DIRECT_MESSAGE_TYPING = 1 << 14,
    PROFILE_UPDATES = 1 << 15,

    ALL = (1 << 16) - 1, // all 1s
}

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
    FriendAdd = 30,
    FriendRemove = 31,
}

export const enum ClientMsgOpcode {
    Heartbeat = 0,
    Identify = 1,
    Resume = 2,
    SetPresence = 3,
    Subscribe = 4,
    Unsubscribe = 5,
}

export type IServerMsg<Opcode extends ServerMsgOpcode, Payload = undefined>
    = Payload extends undefined ? { o: Opcode } : { o: Opcode, p: Payload };

export type ServerMsg =
    | IServerMsg<ServerMsgOpcode.Hello, { heartbeat_interval: number }>
    | IServerMsg<ServerMsgOpcode.HeartbeatAck>
    | IServerMsg<ServerMsgOpcode.Ready, ReadyEvent>
    | IServerMsg<ServerMsgOpcode.InvalidSession>

    | IServerMsg<ServerMsgOpcode.RoleCreate, Role>
    | IServerMsg<ServerMsgOpcode.RoleUpdate, Role>
    | IServerMsg<ServerMsgOpcode.RoleDelete, RoleDeleteEvent>

    | IServerMsg<ServerMsgOpcode.PartyCreate, Party>
    | IServerMsg<ServerMsgOpcode.PartyUpdate, PartyUpdateEvent>
    | IServerMsg<ServerMsgOpcode.PartyDelete, { id: Snowflake }>

    | IServerMsg<ServerMsgOpcode.MemberAdd, PartyMemberEvent>
    | IServerMsg<ServerMsgOpcode.MemberUpdate, PartyMemberEvent>
    | IServerMsg<ServerMsgOpcode.MemberRemove, PartyMemberEvent>
    | IServerMsg<ServerMsgOpcode.MemberBan, PartyMemberEvent>
    | IServerMsg<ServerMsgOpcode.MemberUnban, PartyMemberEvent>

    | IServerMsg<ServerMsgOpcode.RoomCreate, Room>
    | IServerMsg<ServerMsgOpcode.RoomUpdate, Room>
    | IServerMsg<ServerMsgOpcode.RoomDelete, RoomDeleteEvent>

    | IServerMsg<ServerMsgOpcode.MessageCreate, Message>
    | IServerMsg<ServerMsgOpcode.MessageUpdate, Message>
    | IServerMsg<ServerMsgOpcode.MessageDelete, MessageDeleteEvent>

    | IServerMsg<ServerMsgOpcode.MessageReactionAdd, MessageUserReactionEvent>
    | IServerMsg<ServerMsgOpcode.MessageReactionRemove, MessageUserReactionEvent>

    | IServerMsg<ServerMsgOpcode.PresenceUpdate, UserPresenceUpdateEvent>

    | IServerMsg<ServerMsgOpcode.TypingStart, TypingStartEvent>

    | IServerMsg<ServerMsgOpcode.UserUpdate, { user: User }>
    | IServerMsg<ServerMsgOpcode.ProfileUpdate, ProfileUpdateEvent>
    | IServerMsg<ServerMsgOpcode.FriendAdd, Friend>
    | IServerMsg<ServerMsgOpcode.FriendRemove, { user_id: Snowflake }>
    ;

export interface ReadyEvent {
    user: User,
    dms: Room[],
    parties: Party[],
    session: Snowflake,
}

export interface TypingStartEvent {
    room_id: Snowflake,
    party_id?: Snowflake,
    user_id: Snowflake,
    member?: PartyMember,
}

export interface PartyPositionUpdateEvent extends Partial<Party> {
    id: Snowflake,
    position: number,
}

export type PartyUpdateEvent = PartyPositionUpdateEvent | Party;

export interface PartyMemberEvent extends PartyMember {
    party_id: Snowflake,
}

export interface RoleDeleteEvent {
    id: Snowflake,
    party_id: Snowflake,
}

export interface RoomDeleteEvent {
    id: Snowflake,
    party_id?: Snowflake,
}

export interface MessageDeleteEvent {
    id: Snowflake,
    room_id: Snowflake,
    party_id?: Snowflake,
}

export interface MessageUserReactionEvent {
    user_id: Snowflake,
    room_id: Snowflake,
    party_id?: Snowflake,
    msg_id: Snowflake,
    member?: PartyMember,
    emote: EmoteOrEmoji,
}

export interface UserPresenceUpdateEvent {
    user: User,
    party_id?: Snowflake,
    presence: UserPresence,
}

export interface ProfileUpdateEvent {
    party_id?: Snowflake,
    user: User,
}

export type IClientMsg<Opcode extends ClientMsgOpcode, Payload = undefined>
    = Payload extends undefined ? { o: Opcode } : { o: Opcode, p: Payload };

export type ClientMsg =
    | IClientMsg<ClientMsgOpcode.Heartbeat>
    | IClientMsg<ClientMsgOpcode.Identify, Identify>
    | IClientMsg<ClientMsgOpcode.Resume, { session: Snowflake }>
    | IClientMsg<ClientMsgOpcode.SetPresence, UserPresence>
    | IClientMsg<ClientMsgOpcode.Subscribe, { party_id: Snowflake }>
    | IClientMsg<ClientMsgOpcode.Unsubscribe, { party_id: Snowflake }>;

export interface Identify {
    auth: string,
    intent: Intent,
}