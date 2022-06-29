import { relAdorn, relProps, relUpdateSwitch } from "./rel/relMisc";
import { relVarbS } from "./rel/relVarb";
import { relVarbInfo } from "./rel/relVarbInfo";
import { relVarbsS } from "./relVarbs";

export const rel = {
  adorn: relAdorn,
  varbInfo: relVarbInfo,
  props: relProps,
  varb: relVarbS,
  varbs: relVarbsS,
  updateSwitch: relUpdateSwitch,
} as const;
