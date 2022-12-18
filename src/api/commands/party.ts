import { command } from "../command";
import type { Party, PartyMember, Room, Snowflake, Invite, UserProfile, FullPartyMember } from "../../models";

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

export const GetMember = /*#__PURE__*/command.get<{ user_id: Snowflake, party_id: Snowflake }, FullPartyMember>({
    path() { return `/party/${this.party_id}/members/${this.user_id}`; }
});

export const UpdateMemberProfile = /*#__PURE__*/command.patch<{ party_id: Snowflake, profile: UserProfile }, UserProfile, UserProfile>({
    path() { return `/party/${this.party_id}/members/profile`; },
    body: 'profile',
});