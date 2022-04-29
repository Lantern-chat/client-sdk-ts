import { command } from "../command";

import type { Invite } from "../../models";

export const GetInvite = /*#__PURE__*/command<{ code: string }, Invite>({
    path() { return `/invite/${this.code}`; }
});

export const RevokeInvite = /*#__PURE__*/command.del<{ code: string }>({
    path() { return `/invite/${this.code}`; }
});

export interface RedeemInviteForm {
    nickname?: string,
}

export const RedeemInvite = /*#__PURE__*/command.post<{ code: string, form: RedeemInviteForm }, null, RedeemInviteForm>({
    path() { return `/invite/${this.code}/redeem`; },
    body: "form",
});