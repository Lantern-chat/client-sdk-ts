import { command } from "../command";
import type { Cursor, EmoteOrEmoji, Message, Reaction, Snowflake } from "../../models";
import { RoomPermissions, union, cond } from "../../models/permission";

function encode_emote_or_emoji(e: EmoteOrEmoji): string {
    if((e as any).emote) {
        return ':' + (e as any).emote;
    } else {
        return encodeURIComponent((e as any).emoji);
    }
}

export interface CreateMessageBody {
    content?: string,
    parent?: Snowflake,
    attachments?: Array<Snowflake>,
}

export interface GetReactionsQuery {
    after?: Snowflake,
    limit?: number,
}

export const CreateMessage = /*#__PURE__*/command.post<{ room_id: Snowflake, msg: CreateMessageBody }, Message, CreateMessageBody>({
    parse: command.parse,
    path() { return `/room/${this.room_id}/messages`; },
    body: "msg",
    perms() {
        return union(
            { room: RoomPermissions.SEND_MESSAGES },
            cond(!!this.msg.attachments?.length, { room: RoomPermissions.ATTACH_FILES }),
        );
    }
});

export const GetMessage = /*#__PURE__*/command<{ room_id: Snowflake, msg_id: Snowflake }, Message>({
    perms: { room: RoomPermissions.READ_MESSAGES },
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
});

export type GetMessagesBody = Partial<Cursor> & {
    thread?: Snowflake,
    limit?: number
}

export const GetMessages = /*#__PURE__*/command<{ room_id: Snowflake, query: GetMessagesBody }, Array<Message>, GetMessagesBody>({
    perms: { room: RoomPermissions.READ_MESSAGES },
    path() { return `/room/${this.room_id}/messages`; },
    body: "query",
});

export const StartTyping = /*#__PURE__*/command.post<{ room_id: Snowflake }>({
    perms: { room: RoomPermissions.SEND_MESSAGES },
    path() { return `/room/${this.room_id}/typing`; }
});

export const DeleteMessage = /*#__PURE__*/command.del<{ room_id: Snowflake, msg_id: Snowflake }>({
    perms: { room: RoomPermissions.READ_MESSAGES },
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
});

export const PutReaction = /*#__PURE__*/command.put<{ room_id: Snowflake, msg_id: Snowflake, e: EmoteOrEmoji }>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${encode_emote_or_emoji(this.e)}/@me` }
});

export const DeleteOwnReaction = /*#__PURE__*/command.del<{ room_id: Snowflake, msg_id: Snowflake, e: EmoteOrEmoji }>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${encode_emote_or_emoji(this.e)}/@me` }
});

export const DeleteUserReaction = /*#__PURE__*/command.del<{ room_id: Snowflake, msg_id: Snowflake, e: EmoteOrEmoji, user_id: Snowflake }>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${encode_emote_or_emoji(this.e)}/${this.user_id}` }
});

export const DeleteAllReactions = /*#__PURE__*/command.del<{ room_id: Snowflake, msg_id: Snowflake }>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions` }
});

export const GetReactions = /*#__PURE__*/command<{ room_id: Snowflake, msg_id: Snowflake, e: EmoteOrEmoji, query: GetReactionsQuery }, Array<Reaction>, GetReactionsQuery>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}/reactions/${encode_emote_or_emoji(this.e)}` },
    body: "query",
});