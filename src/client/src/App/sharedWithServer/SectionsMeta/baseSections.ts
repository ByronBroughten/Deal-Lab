import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs, baseVarbsS } from "./baseSectionsUtils/baseVarbs";

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "displayName",
  "piCalculationName",
] as const;

export type BaseSections = typeof baseSections;
export const baseSections = {
  root: baseSectionS.container,
  main: baseSection({
    _typeUniformity: "string",
  } as const),
  feStore: baseSection({
    _typeUniformity: "string",
  } as const),
  dbStore: baseSection({
    _typeUniformity: "string",
  } as const),
  omniParent: baseSectionS.container,
  table: baseSection({ titleFilter: "string" } as const),
  tableRow: baseSection({
    displayName: "string",
    compareToggle: "boolean",
  }),
  column: baseSection({
    valueEntityInfo: "inEntityVarbInfo",
  }),
  cell: baseSection({
    valueEntityInfo: "inEntityVarbInfo",
    value: "numObj",
  }),
  conditionalRow: baseSection({
    level: "number",
    type: "string",
    // if
    left: "numObj",
    operator: "string",
    rightList: "stringArray",
    rightValue: "numObj",
    // then
    then: "numObj",
  }),
  singleTimeList: baseSection({
    ...baseVarbsS.savableSection,
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  ongoingList: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  outputList: baseSection(baseVarbsS.savableSection),
  userVarbItem: baseSection({
    ...baseVarbsS.singleVirtualVarb,
    ...baseVarbs("string", [
      "startAdornment",
      "endAdornment",
      "valueSwitch",
    ] as const),
    ...baseVarbs("numObj", ["editorValue"] as const),
  }),
  output: baseSection({
    ...baseVarbsS.singleVirtualVarb,
    ...baseVarbsS.loadableVarb,
  }),
  singleTimeItem: baseSection({
    ...baseVarbsS.singleVirtualVarb,
    ...baseVarbsS.loadableVarb,
    valueSwitch: "string",
    editorValue: "numObj",
  }),
  ongoingItem: baseSection({
    ...baseVarbsS.listItem,
    ...baseVarbsS.loadableVarb,
    ...baseVarbs("string", ["valueSwitch"] as const),
    ...baseVarbs("numObj", ["costToReplace", "editorValue"] as const),
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
  }),
  login: baseSection(baseVarbs("string", ["email", "password"] as const)),
  register: baseSection(
    baseVarbs("string", ["email", "password", "userName"] as const)
  ),
  property: baseSection(baseVarbsS.property),
  unit: baseSection({
    one: "numObj",
    numBedrooms: "numObj",
    ...baseVarbsS.ongoing("targetRent"),
  }),
  propertyGeneral: baseSection(
    omit(baseVarbsS.property, Obj.keys(baseVarbsS.savableSection)),
    {
      hasGlobalVarbs: true,
    }
  ),
  loan: baseSection(baseVarbsS.loan),
  financing: baseSection(
    {
      ...omit(baseVarbsS.loan, loanVarbsNotInFinancing),
      ...baseVarbs("numObj", [
        "downPaymentDollars",
        "downPaymentPercent",
      ] as const),
      ...baseVarbsS.ongoing("piti"),
    },
    {
      hasGlobalVarbs: true,
    }
  ),
  mgmt: baseSection(baseVarbsS.mgmt),
  mgmtGeneral: baseSection(omit(baseVarbsS.mgmt, ["displayName"]), {
    hasGlobalVarbs: true,
  }),
  deal: baseSection(
    {
      ...baseVarbsS.savableSection,
      ...baseVarbs("numObj", [
        "upfrontExpensesSum",
        "upfrontExpenses",
        "upfrontRevenue",
        "totalInvestment",
      ] as const),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("revenue"),
      ...baseVarbsS.ongoing("cashFlow"),
      ...baseVarbsS.ongoing("roi"),
    },
    {
      hasGlobalVarbs: true,
    }
  ),
  user: baseSection(
    baseVarbs("string", ["email", "userName", "apiAccessStatus"] as const)
  ),
  serverOnlyUser: baseSection(
    baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const)
  ),
} as const;

export const simpleSectionNames = Obj.keys(baseSections);
export type SimpleSectionName = typeof simpleSectionNames[number];
export function isSectionName(value: any): value is SimpleSectionName {
  return simpleSectionNames.includes(value);
}

export const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

export type ApiAccessStatus = "readonly" | "basicStorage" | "fullStorage";

type FeSectionName = keyof BaseSections;
export type BaseSectionsGeneral = Record<FeSectionName, GeneralBaseSection>;

const _testBaseSections = <T extends BaseSectionsGeneral>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
