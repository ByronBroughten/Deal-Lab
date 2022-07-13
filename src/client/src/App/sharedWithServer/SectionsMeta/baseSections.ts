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

export type SectionContextNames = {
  sectionName: SimpleSectionName;
  contextName: ContextName;
};

export type ContextName = keyof BaseSections;
const sectionContextNames: ContextName[] = ["fe", "db"];
export const sectionContext = {
  names: sectionContextNames,
  typeCheckContextObj: <T extends Record<ContextName, any>>(obj: T): T => obj,
  makeBlankContextObj(): Record<ContextName, any> {
    return {
      fe: {},
      db: {},
    };
  },
};

export type SectionContextOrBoth = ContextName | "both";
export type ExtractSectionContext<SCB extends SectionContextOrBoth> =
  SCB extends "both" ? ContextName : Exclude<SCB, "both">;
export function extractSectionContext<SCB extends SectionContextOrBoth>(
  sectionContextOrBoth: SCB
): ExtractSectionContext<SCB> {
  if (sectionContextOrBoth === "both" || sectionContextOrBoth === "fe")
    return "fe" as ExtractSectionContext<SCB>;
  else return sectionContextOrBoth as ExtractSectionContext<SCB>;
}

export type BaseSections = typeof baseSections;
export const baseSections = {
  fe: {
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

    singleTimeItem: baseSection({
      ...baseVarbs("string", ["name", "valueSwitch"] as const),
      ...baseVarbs("numObj", ["value", "editorValue"] as const),
      ...baseVarbsS.entityInfo,
    }),
    ongoingItem: baseSection({
      ...baseVarbs("string", ["name", "valueSwitch"] as const),
      ...baseVarbs("numObj", ["costToReplace", "editorValue"] as const),
      ...baseVarbsS.entityInfo,
      ...baseVarbsS.ongoing("value"),
      ...baseVarbsS.switch("lifespan", "monthsYears"),
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
      { title: "string" },
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
      varbInfo: "inEntityVarbInfo",
    }),

    user: baseSection(baseVarbsS.feUser, {
      ...baseOptions.alwaysOneFromStart,
    }),
    serverOnlyUser: baseSection({
      ...baseVarbs("string", [
        "encryptedPassword",
        "emailAsSubmitted",
      ] as const),
    }),
  },
  get db() {
    return this.fe;
  },
} as const;

export const simpleSectionNames = Obj.keys(baseSections.fe);
export type SimpleSectionName = typeof simpleSectionNames[number];
export function isSectionName(value: any): value is SimpleSectionName {
  return simpleSectionNames.includes(value);
}

export const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

export type ApiAccessStatus = "readonly" | "basicStorage" | "fullStorage";

type FeSectionName = keyof BaseSections["fe"];
export type BaseSectionsGeneral = {
  [SC in ContextName]: Record<FeSectionName, GeneralBaseSection>;
};

const _testBaseSections = <T extends BaseSectionsGeneral>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
