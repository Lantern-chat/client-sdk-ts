import { command } from "../command";
import type { Party, PartyMember, Room, Snowflake, Invite, UserProfile, Role, RoleFlags, Permissions } from "../../models";

export const GetParty = /*#__PURE__*/command<{ party_id: Snowflake }, Party>({
    path() { return `/party/${this.party_id}`; }
});

export const GetPartyMembers = /*#__PURE__*/command<{ party_id: Snowflake }, Array<PartyMember>>({
    path() { return `/party/${this.party_id}/members`; }
});

export const GetPartyRooms = /*#__PURE__*/command<{ party_id: Snowflake }, Array<Room>>({
    path() { return `/party/${this.party_id}/rooms`; }
});

export const GetPartyInvites = /*#__PURE__*/command<{ party_id: Snowflake }, Array<Invite>>({
    path() { return `/party/${this.party_id}/invites`; }
});

export interface CreatePartyInviteForm {
    max_uses?: number,
    duration?: number,
    description?: string,
}

export const CreatePartyInvite = /*#__PURE__*/command.post<{ party_id: Snowflake }, Invite, CreatePartyInviteForm>({
    path() { return `/party/${this.party_id}/invites`; }
});

export const GetMember = /*#__PURE__*/command.get<{ user_id: Snowflake, party_id: Snowflake }, PartyMember>({
    path() { return `/party/${this.party_id}/members/${this.user_id}`; }
});

export const UpdateMemberProfile = /*#__PURE__*/command.patch<{ party_id: Snowflake, profile: UserProfile }, UserProfile, UserProfile>({
    path() { return `/party/${this.party_id}/members/profile`; },
    body: 'profile',
});

export interface CreateRoleForm {
    name: string,
}

export interface PatchRoleForm {
    flags?: RoleFlags,
    name?: string,
    color?: number,
    permissions?: Permissions,
    avatar?: Snowflake,
    position?: number,
}

export const CreateRole = /*#__PURE__*/command.post<{ party_id: Snowflake, role: CreateRoleForm }, Role, CreateRoleForm>({
    path() { return `/party/${this.party_id}/roles`; },
    body: 'role',
});

export const PatchRole = /*#__PURE__*/command.patch<{ party_id: Snowflake, role_id: Snowflake, role: PatchRoleForm }, Role, PatchRoleForm>({
    path() { return `/party/${this.party_id}/roles/${this.role_id}`; },
    body: 'role',
});

export const DeleteRole = /*#__PURE__*/command.del<{ party_id: Snowflake, role_id: Snowflake }>({
    path() { return `/party/${this.party_id}/roles/${this.role_id}`; },
});