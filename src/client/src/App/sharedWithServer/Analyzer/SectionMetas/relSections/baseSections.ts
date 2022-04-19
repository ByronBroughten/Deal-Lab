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
  keyof BaseSections[ContextName];

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
  propertyIndex: base.section.schema({
    ...base.varbs.property,
  }),
  loanIndex: base.section.schema({
    ...base.varbs.loan,
  }),
  mgmtIndex: base.section.schema({
    ...base.varbs.mgmt,
  }),
  analysisIndex: base.section.schema({
    ...base.varbs.analysis,
  }),
} as const;

export type UniqueDbBaseSectionName = keyof typeof dbUniqueBaseSections;

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

    column: base.section.schema(base.varbs.varbInfo),
    cell: base.section.schema({ ...base.varbs.varbInfo, value: "numObj" }),
    // for cell, value may not have to be numObj...

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
      { userDefined: true }
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
    userVarbList: base.section.schema(
      { title: "string" },
      base.options.userList
    ),
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
    propertyIndex: base.section.rowIndex,
    propertyTable: base.section.table,
    propertyDefault: base.section.schema(base.varbs.property, {
      ...base.options.defaultSection,
    }),
    propertyGeneral: base.section.schema(omit(base.varbs.property, ["title"]), {
      ...base.options.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }),

    loan: base.section.schema(base.varbs.loan, {}),
    closingCostList: base.section.singleTimeListSolves,
    wrappedInLoanList: base.section.singleTimeListSolves,
    loanIndex: base.section.rowIndex,
    loanTable: base.section.table,
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
    mgmtIndex: base.section.rowIndex,
    mgmtTable: base.section.table,
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
    output: base.section.schema(base.varbs.varbInfo, {}),
    analysisIndex: base.section.rowIndex,
    analysisTable: base.section.table,
    analysisDefault: base.section.schema(base.varbs.analysis, {
      ...base.options.defaultSection,
    }),

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
      loadOnLogin: true,
    }),
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

// as things stand, this is not doing what I want it to.
// I'd have to filter out the children, and then filter out
// the varbs.
// I can do that for every single item
// Right now the clientSide would probably handle it just fine
// The issue is that right now I'm sending the encrypted password to the client.
// How about I cut the user stuff from the sections I send back and send
// what the client needs in an auth token?
// either way, I think the answer is to further specify the dbStoreNames

// make a group of sectionNames that the section
// functions can access

// make a group of sectionNames that the sectionArr function
// can access(?)

// make sure LoginUser isn't based on dbStore

// the user sectionName is the only one of concern for upgradeUserToProj

// make the loginWebToken give apiAccessStatus

// make a middleWare that checks for apiAccessStatus if you try to write
// anything.
// add functionality to addSection that limits saving entries if apiAccessStatus
// isn't upgraded.

type ApiAccessStatus = "readonly" | "basicStorage" | "fullStorage";
// type ApiAccessStatus1 = "guest" | "basicUser" | "proUser";

// the frontend cares about the first ones
// the backend cares about the second ones

// protected: true

// change user layout first
// apiAccessStatus will also be in the webtoken, along with _id

// make dbStoreName and protectedDbStoreName
// or something like that
// or dbStoreNameExposed
// dbStoreNameProtected

// make it so that so long as the db version of a section
// is a superset of the fe version, it can be converted in
// the same way

type FeSectionName = keyof BaseSections["fe"];
export type GeneralBaseSections = {
  [SC in ContextName]: Record<FeSectionName, GeneralBaseSection>;
};

const _testBaseSections = <T extends GeneralBaseSections>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
