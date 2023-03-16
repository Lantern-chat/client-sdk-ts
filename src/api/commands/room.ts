import { command } from "../command";
import type { Cursor, EmoteOrEmoji, Message, Reaction, Snowflake } from "../../models";
import { PermissionBit, Permissions } from "../../models/permission";

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
        let perms = new Permissions(PermissionBit.SEND_MESSAGES);
        if(!!this.msg.attachments?.length) {
            perms.add(PermissionBit.ATTACH_FILES);
        }
        return perms;
    }
});

export const GetMessage = /*#__PURE__*/command<{ room_id: Snowflake, msg_id: Snowflake }, Message>({
    perms: PermissionBit.READ_MESSAGE_HISTORY,
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
});

export type GetMessagesBody = Partial<Cursor> & {
    thread?: Snowflake,
    limit?: number,
    pinned?: boolean,
    starred?: boolean,
}

export const GetMessages = /*#__PURE__*/command<{ room_id: Snowflake, query: GetMessagesBody }, Array<Message>, GetMessagesBody>({
    perms: PermissionBit.READ_MESSAGE_HISTORY,
    path() { return `/room/${this.room_id}/messages`; },
    body: "query",
});

export const StartTyping = /*#__PURE__*/command.post<{ room_id: Snowflake }>({
    perms: PermissionBit.SEND_MESSAGES,
    path() { return `/room/${this.room_id}/typing`; }
});

export const DeleteMessage = /*#__PURE__*/command.del<{ room_id: Snowflake, msg_id: Snowflake }>({
    perms: PermissionBit.READ_MESSAGE_HISTORY,
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