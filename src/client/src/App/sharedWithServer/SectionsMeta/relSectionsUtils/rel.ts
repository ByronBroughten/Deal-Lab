import { relUpdateSwitch } from "./rel/relUpdateSwitch";
import { relVarbS } from "./rel/relVarb";
import { relVarbsS } from "./relVarbs";

export const rel = {
  varb: relVarbS,
  varbs: relVarbsS,
  updateSwitch: relUpdateSwitch,
} as const;
