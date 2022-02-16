import { command } from "../command";
import type { Snowflake } from "../../models";

export interface CreateFileBody {
    filename: string,
    size: number,
    mime?: string,
    width?: number,
    height?: number,
    preview?: string,
}

export const CreateFile = /*#__PURE__*/command.post<{ params: CreateFileBody }, Snowflake, CreateFileBody>({
    parse: command.parse,
    path: "/file",
    body: "params",
});

export const GetFilesystemStatus = /*#__PURE__*/command.options<{}, FilesystemStatus>({
    path: "/file",
});

export interface FilesystemStatus {
    quota_used: number,
    quota_total: number,
}
