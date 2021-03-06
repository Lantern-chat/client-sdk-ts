import { command } from "../command";
import type { Message, Snowflake } from "../../models";
import { RoomPermissions, union, cond } from "../../models/permission";

export interface CreateMessageBody {
    content?: string,
    parent?: Snowflake,
    attachments?: Array<Snowflake>,
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

export interface GetMessagesBody {
    thread?: Snowflake,
    before?: Snowflake,
    after?: Snowflake,
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