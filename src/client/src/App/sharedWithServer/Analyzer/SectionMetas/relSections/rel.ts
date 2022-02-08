import { relAdorn, relProps, relValue, relUpdateSwitch } from "./rel/relMisc";
import { relSection } from "./rel/relSection";
import { relVarb } from "./rel/relVarb";
import { relVarbInfo } from "./rel/relVarbInfo";
import { preVarbs } from "./rel/relVarbs";

export const rel = {
  adorn: relAdorn,
  value: relValue,
  varbInfo: relVarbInfo,
  props: relProps,
  varb: relVarb,
  varbs: preVarbs,
  section: relSection,
  updateSwitch: relUpdateSwitch,
} as const;
