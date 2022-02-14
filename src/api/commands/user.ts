import { command } from "api/command";
import { Friend, Session, Snowflake, UserPreferences } from "models";

import * as perms from "models/permission";
const { R, P, S } = perms;

export interface UserRegisterForm {
    email: string,
    username: string,
    password: string,
    year: number,
    month: number,
    day: number,
    token: string,
}

export const UserRegister = command.post<{ form: UserRegisterForm }, Session, UserRegisterForm>({
    parse: command.parse,
    path: "/user",
    body: "form",
});

export interface UserLoginForm {
    email: string,
    password: string,
    totp?: string,
}

export const UserLogin = command.post<{ form: UserLoginForm, test: Blob }, Session, UserLoginForm>({
    parse: command.parse,
    path: "/user/@me",
    body: "form"
});

export const GetSessions = command<{}, Array<Session>>({
    path: "/user/@me/sessions"
});

export const GetFriends = command<{}, Array<Friend>>({
    path: "/user/@me/friends"
});

export const UpdateUserPrefs = command.patch<{ prefs: Partial<UserPreferences> }, null, Partial<UserPreferences>>({
    path: "/user/@me/prefs",
    body: "prefs",
});