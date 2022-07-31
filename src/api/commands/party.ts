import { command } from "../command";
import type { Party, PartyMember, Room, Snowflake, Invite, UserProfile } from "../../models";

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

export const GetMemberProfile = /*#__PURE__*/command.get<{ user_id: Snowflake, party_id: Snowflake }, UserProfile>({
    path() { return `/party/${this.party_id}/members/${this.user_id}/profile`; }
});
