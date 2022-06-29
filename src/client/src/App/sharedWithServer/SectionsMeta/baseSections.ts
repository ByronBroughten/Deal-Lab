import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import { base } from "./baseSectionsUtils/base";
import {
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs } from "./baseSectionsUtils/baseVarbs";
import { switchEndings } from "./baseSectionsUtils/switchNames";

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
    main: baseSection(
      {
        _typeUniformity: "string",
      } as const,
      { alwaysOne: true }
    ),
    omniParent: baseSectionS.container,
    table: baseSection({ titleFilter: "string" } as const),
    propertyTableStore: baseSectionS.container,
    loanTableStore: baseSectionS.container,
    mgmtTableStore: baseSectionS.container,
    dealTableStore: baseSectionS.container,

    tableRow: baseSection(base.varbs.tableRow, { uniqueDbId: true }),
    column: baseSection(base.varbs.varbInfo),
    cell: baseSection({ ...base.varbs.varbInfo, value: "numObj" }),

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
      ...base.varbs.string(["name", "valueSwitch"] as const),
      ...base.varbs.numObj(["value", "editorValue"] as const),
      ...base.varbs.entityInfo,
    }),
    ongoingItem: baseSection({
      ...base.varbs.string(["name", "valueSwitch"] as const),
      ...base.varbs.numObj(["costToReplace", "editorValue"] as const),
      ...base.varbs.entityInfo,
      ...base.varbs.ongoing("value"),
      ...base.varbs.switch("lifespan", switchEndings.monthsYears),
    }),
    userVarbList: baseSection({
      ...baseVarbs.savableSection,
      defaultValueSwitch: "string",
    }),
    userVarbItem: baseSection(
      {
        ...base.varbs.string([
          "name",
          "startAdornment",
          "endAdornment",
          "valueSwitch",
        ] as const),
        ...base.varbs.numObj(["editorValue", "value"] as const),
      },
      { uniqueDbId: true }
    ),
    outputList: baseSection(
      { title: "string" },
      base.options.alwaysOneFromStart
    ),
    singleTimeList: baseSection(
      base.varbs.singleTimeList,
      base.options.userList
    ),
    ongoingList: baseSection(base.varbs.ongoingList, base.options.userList),
    login: baseSection(
      base.varbs.string(["email", "password"] as const),
      base.options.alwaysOneFromStart
    ),
    register: baseSection(
      base.varbs.string(["email", "password", "userName"] as const),
      base.options.alwaysOneFromStart
    ),
    property: baseSection(base.varbs.property),
    unit: baseSection({
      one: "numObj",
      numBedrooms: "numObj",
      ...base.varbs.ongoing("targetRent"),
    }),
    propertyGeneral: baseSection(
      omit(base.varbs.property, Obj.keys(base.varbs.savableSection)),
      {
        ...base.options.alwaysOneFromStart,
        hasGlobalVarbs: true,
      }
    ),
    loan: baseSection(base.varbs.loan),
    financing: baseSection(
      {
        ...omit(base.varbs.loan, loanVarbsNotInFinancing),
        ...base.varbs.numObj([
          "downPaymentDollars",
          "downPaymentPercent",
        ] as const),
        ...base.varbs.ongoing("piti"),
      },
      {
        ...base.options.alwaysOneFromStart,
        hasGlobalVarbs: true,
      }
    ),

    mgmt: baseSection(base.varbs.mgmt, { makeOneOnStartup: true }),
    mgmtGeneral: baseSection(omit(base.varbs.mgmt, ["title"]), {
      ...base.options.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }),
    deal: baseSection(
      {
        title: "string",
        ...base.varbs.numObj([
          "upfrontExpensesSum",
          "upfrontExpenses",
          "upfrontRevenue",
          "totalInvestment",
        ] as const),
        ...base.varbs.ongoing("expenses"),
        ...base.varbs.ongoing("revenue"),
        ...base.varbs.ongoing("cashFlow"),
        ...base.varbs.ongoing("roi"),
      },
      base.options.alwaysOneFromStart
    ),
    output: baseSection(base.varbs.varbInfo, {}),

    user: baseSection(base.varbs.feUser, {
      ...base.options.alwaysOneFromStart,
    }),
    serverOnlyUser: baseSection({
      ...base.varbs.string(["encryptedPassword", "emailAsSubmitted"] as const),
    }),
  },
  get db() {
    return this.fe;
  },
} as const;

export const simpleSectionNames = Obj.keys(baseSections.fe);
export type SimpleSectionName = typeof simpleSectionNames[number];

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
