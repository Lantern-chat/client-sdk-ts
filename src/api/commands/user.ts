import { command, CommandFlags } from "../command";
import { Friend, Session, UserPreferences } from "../../models";

export interface UserRegisterForm {
    email: string,
    username: string,
    password: string,
    year: number,
    month: number,
    day: number,
    token: string,
}

export const UserRegister = /*#__PURE__*/command.post<{ form: UserRegisterForm }, Session, UserRegisterForm>({
    flags: CommandFlags.UNAUTHORIZED,
    parse: command.parse,
    path: "/user",
    body: "form",
});

export interface UserLoginForm {
    email: string,
    password: string,
    totp?: string,
}

export const UserLogin = /*#__PURE__*/command.post<{ form: UserLoginForm, test: Blob }, Session, UserLoginForm>({
    flags: CommandFlags.UNAUTHORIZED,
    parse: command.parse,
    path: "/user/@me",
    body: "form"
});

export const GetSessions = /*#__PURE__*/command<{}, Array<Session>>({
    path: "/user/@me/sessions"
});

export const GetFriends = /*#__PURE__*/command<{}, Array<Friend>>({
    path: "/user/@me/friends"
});

export const UpdateUserPrefs = /*#__PURE__*/command.patch<{ prefs: Partial<UserPreferences> }, null, Partial<UserPreferences>>({
    path: "/user/@me/prefs",
    body: "prefs",
});