import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseOptions,
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
  "title",
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
  tableRow: baseSection(baseVarbsS.tableRow),
  column: baseSection({
    varbInfo: "inEntityVarbInfo",
  }),
  cell: baseSection({
    varbInfo: "inEntityVarbInfo",
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

  // make "title" be "displayName" for all savableSection
  // search for "title"
  singleTimeList: baseSection(baseVarbsS.singleTimeList),
  ongoingList: baseSection(baseVarbsS.ongoingList),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  outputList: baseSection(
    baseVarbsS.savableSection,
    baseOptions.alwaysOneFromStart
  ),

  // change name to displayName for all these at the same time
  // create baseVarbsS.listItem: {
  // displayName, displayNameEnd, value, valueEntityInfo
  // }

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
    displayNameEnd: "stringObj",
    varbInfo: "inEntityVarbInfo",
  }),
  singleTimeItem: baseSection({
    // valueEntityInfo: "inEntityVarbInfo",
    // displayNameEnd: "stringObj",
    ...baseVarbsS.singleVirtualVarb,
    varbInfo: "inEntityVarbInfo",
    valueSwitch: "string",
    editorValue: "numObj",
  }),
  ongoingItem: baseSection({
    ...baseVarbsS.listItem,
    ...baseVarbs("string", ["valueSwitch"] as const),
    ...baseVarbs("numObj", ["costToReplace", "editorValue"] as const),
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
    varbInfo: "inEntityVarbInfo",
  }),

  login: baseSection(
    baseVarbs("string", ["email", "password"] as const),
    baseOptions.alwaysOneFromStart
  ),
  register: baseSection(
    baseVarbs("string", ["email", "password", "userName"] as const),
    baseOptions.alwaysOneFromStart
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
      ...baseOptions.alwaysOneFromStart,
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
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }
  ),

  mgmt: baseSection(baseVarbsS.mgmt, { makeOneOnStartup: true }),
  mgmtGeneral: baseSection(omit(baseVarbsS.mgmt, ["title"]), {
    ...baseOptions.alwaysOneFromStart,
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
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }
  ),
  user: baseSection(baseVarbsS.feUser, {
    ...baseOptions.alwaysOneFromStart,
  }),
  serverOnlyUser: baseSection({
    ...baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const),
  }),
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
