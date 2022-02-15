import { command } from "../command";
import { Party, PartyMember, Room, Snowflake } from "../../models";

export const GetParty = command<{ party_id: Snowflake }, Party>({
    path() { return `/party/${this.party_id}`; }
});

export const GetPartyMembers = command<{ party_id: Snowflake }, Array<PartyMember>>({
    path() { return `/party/${this.party_id}`; }
});

export const GetPartyRooms = command<{ party_id: Snowflake }, Array<Room>>({
    path() { return `/party/${this.party_id}`; }
});