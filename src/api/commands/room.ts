import { command } from "../command";
import { Message, Snowflake } from "../../models";
import { RoomPermissions, union, cond } from "../../models/permission";

export interface CreateMessageBody {
    content?: string,
    parent?: Snowflake,
    attachments?: Array<Snowflake>,
}

export const CreateMessage = command.post<{ room_id: Snowflake, msg: CreateMessageBody }, Message, CreateMessageBody>({
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

export const GetMessage = command<{ room_id: Snowflake, msg_id: Snowflake }, Message>({
    perms: { room: RoomPermissions.READ_MESSAGES },
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
});

export interface GetMessagesBody {
    thread?: Snowflake,
    before?: Snowflake,
    after?: Snowflake,
    limit?: number
}

export const GetMessages = command<{ room_id: Snowflake, query: GetMessagesBody }, Array<Message>, GetMessagesBody>({
    perms: { room: RoomPermissions.READ_MESSAGES },
    path() { return `/room/${this.room_id}/messages`; },
    body: "query",
});

export const StartTyping = command.post<{ room_id: Snowflake }>({
    perms: { room: RoomPermissions.SEND_MESSAGES },
    path() { return `/room/${this.room_id}/typing`; }
});