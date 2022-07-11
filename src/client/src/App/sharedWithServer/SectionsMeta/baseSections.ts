import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseOptions,
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs } from "./baseSectionsUtils/baseVarbs";

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

    tableRow: baseSection(baseVarbs.tableRow, { uniqueDbId: true }),
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
      ...baseVarbs.string(["name", "valueSwitch"] as const),
      ...baseVarbs.numObj(["value", "editorValue"] as const),
      ...baseVarbs.entityInfo,
    }),
    ongoingItem: baseSection({
      ...baseVarbs.string(["name", "valueSwitch"] as const),
      ...baseVarbs.numObj(["costToReplace", "editorValue"] as const),
      ...baseVarbs.entityInfo,
      ...baseVarbs.ongoing("value"),
      ...baseVarbs.switch("lifespan", "monthsYears"),
    }),
    userVarbList: baseSection({
      ...baseVarbs.savableSection,
      defaultValueSwitch: "string",
    }),
    userVarbItem: baseSection(
      {
        ...baseVarbs.string([
          "name",
          "startAdornment",
          "endAdornment",
          "valueSwitch",
        ] as const),
        ...baseVarbs.numObj(["editorValue", "value"] as const),
      },
      { uniqueDbId: true }
    ),
    outputList: baseSection(
      { title: "string" },
      baseOptions.alwaysOneFromStart
    ),
    singleTimeList: baseSection(baseVarbs.singleTimeList, baseOptions.userList),
    ongoingList: baseSection(baseVarbs.ongoingList, baseOptions.userList),
    login: baseSection(
      baseVarbs.string(["email", "password"] as const),
      baseOptions.alwaysOneFromStart
    ),
    register: baseSection(
      baseVarbs.string(["email", "password", "userName"] as const),
      baseOptions.alwaysOneFromStart
    ),
    property: baseSection(baseVarbs.property),
    unit: baseSection({
      one: "numObj",
      numBedrooms: "numObj",
      ...baseVarbs.ongoing("targetRent"),
    }),
    propertyGeneral: baseSection(
      omit(baseVarbs.property, Obj.keys(baseVarbs.savableSection)),
      {
        ...baseOptions.alwaysOneFromStart,
        hasGlobalVarbs: true,
      }
    ),
    loan: baseSection(baseVarbs.loan),
    financing: baseSection(
      {
        ...omit(baseVarbs.loan, loanVarbsNotInFinancing),
        ...baseVarbs.numObj([
          "downPaymentDollars",
          "downPaymentPercent",
        ] as const),
        ...baseVarbs.ongoing("piti"),
      },
      {
        ...baseOptions.alwaysOneFromStart,
        hasGlobalVarbs: true,
      }
    ),

    mgmt: baseSection(baseVarbs.mgmt, { makeOneOnStartup: true }),
    mgmtGeneral: baseSection(omit(baseVarbs.mgmt, ["title"]), {
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }),
    deal: baseSection(
      {
        ...baseVarbs.savableSection,
        ...baseVarbs.numObj([
          "upfrontExpensesSum",
          "upfrontExpenses",
          "upfrontRevenue",
          "totalInvestment",
        ] as const),
        ...baseVarbs.ongoing("expenses"),
        ...baseVarbs.ongoing("revenue"),
        ...baseVarbs.ongoing("cashFlow"),
        ...baseVarbs.ongoing("roi"),
      },
      {
        ...baseOptions.alwaysOneFromStart,
        hasGlobalVarbs: true,
      }
    ),
    output: baseSection({
      varbInfo: "inEntityVarbInfo",
    }),

    user: baseSection(baseVarbs.feUser, {
      ...baseOptions.alwaysOneFromStart,
    }),
    serverOnlyUser: baseSection({
      ...baseVarbs.string(["encryptedPassword", "emailAsSubmitted"] as const),
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
