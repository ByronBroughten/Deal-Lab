import {
  getBaseVarb,
  sectionVarbNames,
  VarbName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { maxRounding } from "../baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { GeneralBaseVarb, ValueUnit } from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import { displayVarb, DisplayVarb, DisplayVarbOptions } from "./displayVarb";

type DisplaySectionVarbsProp<SN extends SectionName> = {
  [S in SN]: DisplaySectionVarbs<SN>;
};
export function displaySectionVarbsProp<SN extends SectionName>(
  sectionName: SN,
  options: Partial<DisplaySectionVarbs<SN>> = {}
): DisplaySectionVarbsProp<SN> {
  return {
    [sectionName]: displaySectionVarbs(sectionName, options),
  } as DisplaySectionVarbsProp<SN>;
}

type SectionVarbsOptions<SN extends SectionName> = Partial<{
  [VN in VarbName<SN>]: Partial<DisplayVarb>;
}>;

export type DisplaySectionVarbs<SN extends SectionName> = {
  [VN in VarbName<SN>]: DisplayVarb;
};

const displayUnitProps: Record<ValueUnit, DisplayVarbOptions> = {
  dollars: { startAdornment: "$", displayRound: 2 },
  percent: { endAdornment: "%", displayRound: 3 },
  decimal: { displayRound: 5 },
  absolute: { displayRound: maxRounding },
};

export function displaySectionVarbs<SN extends SectionName>(
  sectionName: SN,
  options: SectionVarbsOptions<SN> = {}
): DisplaySectionVarbs<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((full, varbName) => {
    const baseVarb = getBaseVarb(
      sectionName,
      varbName
    ) as any as GeneralBaseVarb;
    const varbOptions = {
      ...displayUnitProps[baseVarb.valueUnit],
      ...(options[varbName] ?? {}),
    };
    full[varbName] = displayVarb("", varbOptions);
    return full;
  }, {} as DisplaySectionVarbs<SN>);
}
