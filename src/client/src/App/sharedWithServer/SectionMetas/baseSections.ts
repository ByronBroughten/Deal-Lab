import { omit } from "lodash";
import { base } from "./baseSections/base";
import { GeneralBaseSection } from "./baseSections/baseSection";
import { switchEndings } from "./baseSections/switchNames";
// For what I'm trying to do, I must split base
// sections, then I must split relSections
// then I must split secitonMetas.

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "title",
] as const;

export type AnySectionName = keyof BaseSections[ContextName];
export type SimpleSectionName<SC extends ContextName = ContextName> =
  keyof BaseSections["fe"];

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

const dbUniqueBaseSections = {
  user: base.section.schema({
    ...base.varbs.feUser,
    ...base.varbs.string(["encryptedPassword", "emailAsSubmitted"] as const),
  }),
} as const;

export type BaseSections = typeof baseSections;
export const baseSections = {
  fe: {
    main: base.section.schema(
      {
        // _placeholder: "string"
      } as const,
      {
        alwaysOne: true,
      }
    ),

    propertyIndexNext: base.section.schema(base.varbs.property, {
      uniqueDbId: true,
    }),
    loanIndexNext: base.section.schema(base.varbs.loan, { uniqueDbId: true }),
    mgmtIndexNext: base.section.schema(base.varbs.mgmt, { uniqueDbId: true }),
    analysisIndexNext: base.section.schema(base.varbs.analysis, {
      uniqueDbId: true,
    }),

    propertyTableNext: base.section.tableNext,
    loanTableNext: base.section.tableNext,
    mgmtTableNext: base.section.tableNext,
    analysisTableNext: base.section.tableNext,

    tableRow: base.section.schema(base.varbs.tableRow, { uniqueDbId: true }),
    column: base.section.schema(base.varbs.varbInfo),
    cell: base.section.schema({ ...base.varbs.varbInfo, value: "numObj" }),

    conditionalRow: base.section.schema({
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

    singleTimeItem: base.section.schema({
      ...base.varbs.string(["name", "valueSwitch"] as const),
      ...base.varbs.numObj(["value", "editorValue"] as const),
      ...base.varbs.entityInfo,
    }),
    ongoingItem: base.section.schema({
      ...base.varbs.string(["name", "valueSwitch"] as const),
      ...base.varbs.numObj(["costToReplace", "editorValue"] as const),
      ...base.varbs.entityInfo,
      ...base.varbs.ongoing("value"),
      ...base.varbs.switch("lifespan", switchEndings.monthsYears),
    }),
    userVarbItem: base.section.schema(
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
    // these solve.
    upfrontCostList: base.section.singleTimeListSolves,
    upfrontRevenueList: base.section.singleTimeListSolves,
    ongoingCostList: base.section.ongoingListSolves,
    ongoingRevenueList: base.section.ongoingListSolves,

    userSingleList: base.section.schema(
      base.varbs.singleTimeList,
      base.options.userList
    ),
    userOngoingList: base.section.schema(
      base.varbs.ongoingList,
      base.options.userList
    ),
    userVarbList: base.section.varbList(base.options.userList),
    dealVarbList: base.section.varbList(),
    login: base.section.schema(
      base.varbs.string(["email", "password"] as const),
      base.options.alwaysOneFromStart
    ),
    register: base.section.schema(
      base.varbs.string(["email", "password", "userName"] as const),
      base.options.alwaysOneFromStart
    ),
    property: base.section.schema(base.varbs.property, {
      makeOneOnStartup: true,
      solvesForFinal: true,
    }),
    unit: base.section.schema({
      one: "numObj",
      numBedrooms: "numObj",
      ...base.varbs.ongoing("targetRent"),
    }),
    propertyDefault: base.section.schema(
      base.varbs.property,
      base.options.defaultSection
    ),
    propertyGeneral: base.section.schema(omit(base.varbs.property, ["title"]), {
      ...base.options.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }),

    loan: base.section.schema(base.varbs.loan, {}),
    closingCostList: base.section.singleTimeListSolves,
    wrappedInLoanList: base.section.singleTimeListSolves,
    loanDefault: base.section.schema(base.varbs.loan, {
      ...base.options.defaultSection,
    }),
    financing: base.section.schema(
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

    mgmt: base.section.schema(base.varbs.mgmt, { makeOneOnStartup: true }),
    mgmtDefault: base.section.schema(base.varbs.mgmt, {
      ...base.options.defaultSection,
    }),
    mgmtGeneral: base.section.schema(omit(base.varbs.mgmt, ["title"]), {
      ...base.options.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }),
    analysis: base.section.schema(
      { title: "string" },
      base.options.alwaysOneFromStart
    ),
    dealOutputList: base.section.schema(
      { title: "string" },
      base.options.alwaysOneFromStart
    ),
    userOutputList: base.section.schema(
      { title: "string" },
      { uniqueDbId: true }
    ),
    outputListDefault: base.section.schema(
      { title: "string" },
      base.options.defaultSection
    ),
    output: base.section.schema(base.varbs.varbInfo, {}),
    totalInsAndOuts: base.section.schema(
      {
        ...base.varbs.numObj([
          "upfrontExpensesSum",
          "upfrontExpenses",
          "upfrontRevenue",
        ] as const),
        ...base.varbs.ongoing("expenses"),
        ...base.varbs.ongoing("revenue"),
      },
      { ...base.options.alwaysOneFromStart, hasGlobalVarbs: true }
    ),
    final: base.section.schema(
      {
        totalInvestment: "numObj",
        ...base.varbs.ongoing("cashFlow"),
        ...base.varbs.ongoing("roi"),
      },
      { ...base.options.alwaysOneFromStart, hasGlobalVarbs: true }
    ),
    user: base.section.schema(base.varbs.feUser, {
      ...base.options.alwaysOneFromStart,
    }),
    // alright, let's do user.
    // I have two options:
    // 1. make user and userProtected, and make userProtected
    // be one of those that always has 0 entries on the front-end

    // that is probably the simplest way to go.
    // The more secure way to go would be to just have "user"
    // and then manually add userProtected to dbUser and the mongoDb thing

    // I might as well try the second way, because i don't know how it will go.
  },
  get db() {
    return {
      ...this.fe,
      ...dbUniqueBaseSections,
    } as const;
  },
} as const;

// double-check that creating the login-user only
// gives email, userName, and apiAccessStatus

// when creating the loginUser, handle user separately

// I can handle each of the three dbStoreName types separately.
// I'm already handling the first two.
// I just need to do something special for the user.

// make sure LoginUser isn't based on dbStore

// make the loginWebToken have apiAccessStatus

// make a middleware that checks whether the user has fullStorage, or whether they have
// limitedStorage with less than three entries in a given section
// Apply this to addSection
// Apply this to updateSection and addSectionArr, too.
// Limit addSection on the frontEnd for addSectionArr sections
// "Upgrade to pro to save more than 2 of a given type of entry."

// I'll need to limit the number of sectionArrs they can add and save as well, whether
// for variables or lists.

type ApiAccessStatus = "readonly" | "basicStorage" | "fullStorage";

type FeSectionName = keyof BaseSections["fe"];
export type GeneralBaseSections = {
  [SC in ContextName]: Record<FeSectionName, GeneralBaseSection>;
};

const _testBaseSections = <T extends GeneralBaseSections>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
