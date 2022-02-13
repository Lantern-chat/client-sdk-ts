import { command } from "api/command";
import { Message, Snowflake } from "models";

export interface CreateFileBody {
    filename: string,
    size: number,
    mime?: string,
    width?: number,
    height?: number,
    preview?: string,
}

export const CreateFile = command.post<{ params: CreateFileBody }, Snowflake, CreateFileBody>({
    path: "/file",
    body() { return this.params; }
});

export const GetFilesystemStatus = command.options<{}, FilesystemStatus>({
    path: "/file",
});

export interface FilesystemStatus {
    quota_used: number,
    quota_total: number,
}
