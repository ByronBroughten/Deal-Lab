import { relAdorn, relProps, relUpdateSwitch, relValue } from "./rel/relMisc";
import { relSection } from "./rel/relSection";
import { relVarb } from "./rel/relVarb";
import { relVarbInfo } from "./rel/relVarbInfo";
import { relVarbs } from "./rel/relVarbs";

export const rel = {
  adorn: relAdorn,
  value: relValue,
  varbInfo: relVarbInfo,
  props: relProps,
  varb: relVarb,
  varbs: relVarbs,
  section: relSection,
  updateSwitch: relUpdateSwitch,
} as const;
