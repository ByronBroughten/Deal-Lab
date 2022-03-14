import { omit } from "lodash";
import { switchEndings } from "./baseSections/switchNames";
import { base } from "./baseSections/base";

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "title",
] as const;

export const baseSections = {
  main: base.section.schema({} as const, { alwaysOne: true }),

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
  userVarbList: base.section.schema({ title: "string" }, base.options.userList),

  user: base.section.schema(
    base.varbs.string(["email", "userName", "emailLower"] as const),
    {
      ...base.options.alwaysOneFromStart,
      loadOnLogin: true,
    }
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
} as const;

// Ok, so I want to define the dbSec

export const dbSectionSchemas = {
  user: {
    varbs: {
      userName: "string",
      email: "string",
      emailLower: "string",
    },
  },
  userProtected: {
    varbs: {
      encryptedPassword: "string",
    },
  },

  propertyIndex: base.section.schema({
    ...base.varbs.property,
    ...base.varbs.tableRow,
  }),
  property: base.section.propertyBase,
  propertyDefault: base.section.propertyBase,
  propertyTable: base.section.table,

  loan: {},
  loanIndex: {},
  loanDefault: {},
  loanTable: {},

  mgmt: {},
  mgmtIndex: {},
  mgmtDefault: {},
  mgmtTable: {},

  analysis: {},
  analysisIndex: {},
  analysisDefault: {},
  analysisTable: {},

  userVarbList: {},
  userSingleList: {},
  userOngoingList: {},
} as const;
