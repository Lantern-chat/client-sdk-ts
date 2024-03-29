import { command } from "../command";
import type { ServerConfig } from "../../models";

export const GetServerConfig = /*#__PURE__*/command.get<{}, ServerConfig>({
    path() { return '/config'; }
});