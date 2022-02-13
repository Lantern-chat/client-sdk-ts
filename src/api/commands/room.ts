import { command } from "api/command";
import { Message, Snowflake } from "models";

export interface CreateMessageBody {
    content?: string,
    parent?: Snowflake,
    attachments?: Array<Snowflake>,
}

export const CreateMessage = command.post<{ room_id: Snowflake, msg: CreateMessageBody }, Message, CreateMessageBody>({
    path() { return `/room/${this.room_id}/messages`; },
    body() { return this.msg; },
    parse: command.parse,
});

export const GetMessage = command<{ room_id: Snowflake, msg_id: Snowflake }, Message>({
    path() { return `/room/${this.room_id}/messages/${this.msg_id}`; },
});

export interface GetMessagesBody {
    thread?: Snowflake,
    before?: Snowflake,
    after?: Snowflake,
    limit?: number
}

export const GetMessages = command<{ room_id: Snowflake, query?: GetMessagesBody }, Array<Message>, GetMessagesBody>({
    path() { return `/room/${this.room_id}/messages`; },
    body() { return this.query || {}; }
});

export const StartTyping = command.post<{ room_id: Snowflake }>({
    path() { return `/room/${this.room_id}/typing`; }
});