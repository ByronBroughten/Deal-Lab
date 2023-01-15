import {
  getBaseVarb,
  sectionVarbNames,
  VarbName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import {
  GeneralBaseVarb,
  ValueTimespan,
  ValueUnit,
} from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import { displayVarb, DisplayVarb, DisplayVarbOptions } from "./displayVarb";

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

const percent = { endAdornment: "%", displayRound: 3 };
const dollars = { startAdornment: "$", displayRound: 2 };
const standardMonthly = { endAdornment: "/month", displayRound: 2 };
const standardYearly = { endAdornment: "/year", displayRound: 2 };
const standardUnit = {
  monthly: standardMonthly,
  yearly: standardMonthly,
  oneTime: {},
};
const timeRound = { displayRound: 2 };
const months = { ...timeRound, endAdornment: "months" };
const years = { ...timeRound, endAdornment: "years" };
const displayByUnitAndSpan: Record<
  ValueUnit,
  Record<ValueTimespan, DisplayVarbOptions>
> = {
  dollars: {
    monthly: { ...dollars, ...standardMonthly },
    yearly: { ...dollars, ...standardYearly },
    oneTime: dollars,
  },
  percent: {
    monthly: { ...percent, endAdornment: "% monthly" },
    yearly: { ...percent, endAdornment: "% annual" },
    oneTime: percent,
  },
  decimal: standardUnit,
  absolute: standardUnit,
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
    const { valueUnit, valueTimespan } = getBaseVarb(
      sectionName,
      varbName
    ) as any as GeneralBaseVarb;
    sectionVarbs[varbName] = displayVarb("", {
      ...displayByUnitAndSpan[valueUnit][valueTimespan],
      ...(options[varbName] ?? {}),
    });
    return sectionVarbs;
  }, {} as DisplaySectionVarbs<SN>);
}
