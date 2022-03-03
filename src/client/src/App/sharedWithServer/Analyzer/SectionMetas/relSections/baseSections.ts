import { omit } from "lodash";
import { base } from "./baseSections/base";
import { GeneralBaseSection } from "./baseSections/baseSection";
import { Obj } from "../../../utils/Obj";

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "title",
] as const;

export const baseSections = {
  fe: {
    analysis: base.section.schema(
      base.varbs.title(),
      base.options.alwaysOneFromStart
    ),
    output: base.section.schema(base.varbs.varbInfo, {}),
    analysisIndex: base.section.rowIndex,
    analysisTable: base.section.table,
    analysisDefault: base.section.schema(base.varbs.analysis, {
      ...base.options.defaultSection,
    }),

    column: base.section.schema(base.varbs.varbInfo),
    cell: base.section.schema({
      ...base.varbs.varbInfo,
      ...base.varbs.numObj("value"),
    }),
    // for cell, value may not have to be numObj...

    tableRowInfo: base.section.schema(base.varbs.tableRowInfo),
    conditionalRow: base.section.schema({
      ...base.varbs.type("level", "number"),
      ...base.varbs.string("type"),
      // if
      ...base.varbs.numObj("left"),
      ...base.varbs.string("operator"),
      ...base.varbs.type("rightList", "stringArray"),
      ...base.varbs.numObj("rightValue"),
      // then
      ...base.varbs.numObj("then"),
    }),

    singleTimeItem: base.section.schema({
      ...base.varbs.defaultString(["name", "valueSwitch"] as const),
      ...base.varbs.defaultNumObj(["value", "editorValue"] as const),
      ...base.varbs.entityInfo,
    }),
    ongoingItem: base.section.schema({
      ...base.varbs.defaultString(["name", "valueSwitch"] as const),
      ...base.varbs.defaultNumObj(["costToReplace", "editorValue"] as const),
      ...base.varbs.entityInfo,
      ...base.varbs.ongoing("value"),
      ...base.varbs.switch("lifespan", "monthsYears"),
    }),
    userVarbItem: base.section.schema({
      ...base.varbs.defaultString([
        "name",
        "startAdornment",
        "endAdornment",
        "valueSwitch",
      ] as const),
      ...base.varbs.defaultNumObj(["editorValue", "value"] as const),
    }),
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
      base.varbs.title(),
      base.options.userList
    ),

    user: base.section.schema(
      base.varbs.defaultString(["email", "userName", "emailLower"] as const),
      {
        ...base.options.alwaysOneFromStart,
        loadOnLogin: true,
      }
    ),
    login: base.section.schema(
      base.varbs.defaultString(["email", "password"] as const),
      base.options.alwaysOneFromStart
    ),
    register: base.section.schema(
      base.varbs.defaultString(["email", "password", "userName"] as const),
      base.options.alwaysOneFromStart
    ),
    property: base.section.schema(base.varbs.property, {
      makeOneOnStartup: true,
      solvesForFinal: true,
    }),
    unit: base.section.schema({
      ...base.varbs.numObj("one", { selectable: false }),
      ...base.varbs.numObj("numBedrooms"),
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
        ...base.varbs.defaultNumObj([
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

    totalInsAndOuts: base.section.schema(
      {
        ...base.varbs.defaultNumObj([
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
        ...base.varbs.numObj("totalInvestment"),
        ...base.varbs.ongoing("cashFlow"),
        ...base.varbs.ongoing("roi"),
      },
      { ...base.options.alwaysOneFromStart, hasGlobalVarbs: true }
    ),
  } as const,
  get db() {
    return Obj.merge(this.fe, {
      userProtected: base.section.schema(
        base.varbs.string("encryptedPassword", { selectable: false }),
        { protected: true }
      ),
      // to save memory the indexes have row sections on the frontend
      // but full sections in the db
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
    } as const);
  },
} as const;

const testBaseSections = (_: Record<string, GeneralBaseSection>): void =>
  undefined;
testBaseSections(baseSections.fe);
testBaseSections(baseSections.db);

export type SectionContext = keyof BaseSections;
export type BaseSections = typeof baseSections;
export type SimpleSectionName<SC extends SectionContext = "fe"> =
  keyof BaseSections[SC];
