import { command } from "../command";
import { Party, PartyMember, Room, Snowflake } from "../../models";

export const GetParty = /*#__PURE__*/command<{ party_id: Snowflake }, Party>({
    path() { return `/party/${this.party_id}`; }
});

export const GetPartyMembers = /*#__PURE__*/command<{ party_id: Snowflake }, Array<PartyMember>>({
    path() { return `/party/${this.party_id}/members`; }
});

export const GetPartyRooms = /*#__PURE__*/command<{ party_id: Snowflake }, Array<Room>>({
    path() { return `/party/${this.party_id}/rooms`; }
});