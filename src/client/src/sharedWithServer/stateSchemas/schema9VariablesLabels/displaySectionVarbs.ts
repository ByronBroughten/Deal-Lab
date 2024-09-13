import {
  getBaseVarb,
  sectionVarbNames,
  VarbName,
} from "../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { SectionName } from "../schema2SectionNames";
import {
  GeneralBaseVarb,
  ValueFrequency,
  ValueUnit,
} from "../schema3SectionStructures/baseVarbs";
import {
  decimalRounding,
  maxRounding,
  percentRounding,
} from "../schema4ValueTraits/StateValue/stateValuesShared/calculations/numUnitParams";
import { DisplayVarb, displayVarb, DisplayVarbOptions } from "./displayVarb";

type DisplaySectionVarbsProp<SN extends SectionName> = {
  [S in SN]: DisplaySectionVarbs<SN>;
};

export function displaySectionVarbsProp<SN extends SectionName>(
  sectionName: SN,
  options: DisplaySectionVarbsOptions<SN> = {}
): DisplaySectionVarbsProp<SN> {
  return {
    [sectionName]: displaySectionVarbs(sectionName, options),
  } as DisplaySectionVarbsProp<SN>;
}

const dollars = { startAdornment: "$", displayRound: 2, calculateRound: 2 };
const percent = {
  endAdornment: "%",
  displayRound: 3,
  calculateRound: percentRounding,
};
const decimal = { displayRound: 5, calculateRound: decimalRounding };
const absolute = { displayRound: 5, calculateRound: maxRounding };

const monthly = { endAdornment: "/month" };
const yearly = { endAdornment: "/year" };

const timeRound = { displayRound: 2, calculateRound: decimalRounding };
const months = { ...timeRound, endAdornment: " months" };
const years = { ...timeRound, endAdornment: " years" };

const displayByUnitAndSpan: Record<
  ValueUnit,
  Record<ValueFrequency, DisplayVarbOptions>
> = {
  dollars: {
    monthly: { ...dollars, ...monthly },
    yearly: { ...dollars, ...yearly },
    oneTime: dollars,
  },
  percent: {
    monthly: { ...percent, endAdornment: "% monthly" },
    yearly: { ...percent, endAdornment: "% annual" },
    oneTime: percent,
  },
  decimal: {
    monthly: { ...decimal, ...monthly },
    yearly: { ...decimal, ...yearly },
    oneTime: decimal,
  },
  absolute: {
    monthly: { ...absolute, ...monthly },
    yearly: { ...absolute, ...yearly },
    oneTime: absolute,
  },
  months: {
    monthly: months,
    yearly: months,
    oneTime: months,
  },
  years: {
    monthly: years,
    yearly: years,
    oneTime: years,
  },
};

export type DisplaySectionVarbs<SN extends SectionName> = {
  [VN in VarbName<SN>]: DisplayVarb;
};
type DisplaySectionVarbsOptions<SN extends SectionName> = Partial<{
  [VN in VarbName<SN>]: Partial<DisplayVarb>;
}>;
export function displaySectionVarbs<SN extends SectionName>(
  sectionName: SN,
  options: DisplaySectionVarbsOptions<SN> = {}
): DisplaySectionVarbs<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((sectionVarbs, varbName) => {
    const { valueUnit, valueFrequency } = getBaseVarb(
      sectionName,
      varbName
    ) as any as GeneralBaseVarb;
    sectionVarbs[varbName] = displayVarb({
      ...displayByUnitAndSpan[valueUnit][valueFrequency],
      ...(options[varbName] ?? {}),
    });
    return sectionVarbs;
  }, {} as DisplaySectionVarbs<SN>);
}
