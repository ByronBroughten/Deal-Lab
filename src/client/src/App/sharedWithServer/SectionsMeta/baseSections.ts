import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseOptions,
  baseSection,
  baseSectionS,
  GeneralBaseSection
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
  // I could change "name" to "itemName" in both of them.

  // These two listItems could easily be capable of being virtualVarbs
  // That's easy.

  // Should they be able to draw from virtualVarbs?
  // Well, they already can. They have the varbInfo.

  // They need their "name" to appropriately update.

  // "name" needs to be a stringObj.
  // let's change it to "itemName" and make it a stringObj
  // so that it can update in response to the virtual varb updating.
  // I'll need to create and use a stringObj editor.
  // do I need the name ending?
  // I guess so.
  // That would be called itemNameEnding
  // Or I can call it displayNameEnding.
  // It doesn't really matter.

  // what about value?
  // That could be itemValue
  // I can just leave it as value
  // I'll just leave it as value.
  // I really don't like the name "varbInfo"

  // Ok. name is probably fine.
  // But then I would use nameEnding.

  // In those cases I almost might as well use displayName
  // and displayNameEnd

  // the list titles could also be switched to displayName.
  // they might as well.

  // this is how we do.
  singleTimeItem: baseSection({
    name: "stringObj",

    varbInfo: "inEntityVarbInfo",
    // valueEntityInfo: "inEntityVarbInfo",

    // displayNameEnd: "stringObj",

    valueSwitch: "string",
    ...baseVarbs("numObj", ["value", "editorValue"] as const),
  }),
  // the important thing is "name" and "value"
  ongoingItem: baseSection({
    ...baseVarbs("string", ["name", "valueSwitch"] as const),
    ...baseVarbs("numObj", ["costToReplace", "editorValue"] as const),
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
    varbInfo: "inEntityVarbInfo",
  }),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  userVarbItem: baseSection({
    ...baseVarbs("string", [
      "name",
      "startAdornment",
      "endAdornment",
      "valueSwitch",
    ] as const),
    ...baseVarbs("numObj", ["editorValue", "value"] as const),
  }),
  outputList: baseSection(
    baseVarbsS.savableSection,
    baseOptions.alwaysOneFromStart
  ),
  singleTimeList: baseSection(baseVarbsS.singleTimeList),
  ongoingList: baseSection(baseVarbsS.ongoingList),
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
  output: baseSection({
    value: "numObj",
    displayName: "stringObj",
    displayNameEnd: "stringObj",
    varbInfo: "inEntityVarbInfo",
  }),
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
