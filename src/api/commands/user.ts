import { command, CommandFlags } from "../command";

import type { Relationship, Session, UserPreferences, Snowflake, UserProfile, User, UserRelationship } from "../../models";

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

export const UserLogin = /*#__PURE__*/command.post<{ form: UserLoginForm }, Session, UserLoginForm>({
    flags: CommandFlags.UNAUTHORIZED,
    parse: command.parse,
    path: "/user/@me",
    body: "form"
});

export const GetSessions = /*#__PURE__*/command<{}, Array<Session>>({
    path: "/user/@me/sessions"
});

/// Clears all **other** sessions.
export const ClearSessions = /*#__PURE__*/command.del({
    path: "/user/@me/sessions"
});

export const GetRelationships = /*#__PURE__*/command<{}, Array<Relationship>>({
    path: "/user/@me/relationships"
});

export interface PatchRelationshipForm {
    rel?: UserRelationship | null,
    note?: string | null,
}

export const PatchRelationship = /*#__PURE__*/command.patch<{ user_id: Snowflake, form: PatchRelationshipForm }, Relationship, PatchRelationshipForm>({
    path() { return `/user/@me/relationships/${this.user_id}`; },
    body: "form"
});

export const UpdateUserProfile = /*#__PURE__*/command.patch<{ profile: UserProfile }, UserProfile, UserProfile>({
    path() { return `/user/@me/profile`; },
    body: 'profile',
});

export const GetUser = /*#__PURE__*/command.get<{ user_id: Snowflake }, User>({
    path() { return `/user/${this.user_id}`; }
});

export const UpdateUserPrefs = /*#__PURE__*/command.patch<{ prefs: Partial<UserPreferences> }, null, Partial<UserPreferences>>({
    path: "/user/@me/prefs",
    body: "prefs",
});

export const UserLogout = /*#__PURE__*/command.del({
    path: "/user/@me"
});