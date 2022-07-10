import { relUpdateSwitch } from "./rel/relUpdateSwitch";
import { relVarbS } from "./rel/relVarb";

export const rel = {
  varb: relVarbS,
  updateSwitch: relUpdateSwitch,
} as const;
