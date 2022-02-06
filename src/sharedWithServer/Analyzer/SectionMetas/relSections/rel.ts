import { preAdorn, preProps, preValue, updateSwitchMold } from "./rel/relMisc";
import { relSection } from "./rel/relSection";
import { relVarb } from "./rel/relVarb";
import { preVarbInfo } from "./rel/relVarbInfo";
import { preVarbs } from "./rel/relVarbs";

export const rel = {
  adorn: preAdorn,
  value: preValue,
  varbInfo: preVarbInfo,
  props: preProps,
  varb: relVarb,
  varbs: preVarbs,
  section: relSection,
  updateSwitch: updateSwitchMold,
} as const;
