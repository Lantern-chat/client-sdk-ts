import { command } from "../command";
import type { ServerConfig } from "../../models";

export const GetServerConfig = /*#__PURE__*/command<{}, ServerConfig>({
    path() { return '/config'; }
});