import { DbEntry } from "../../../../../DbEntry";
import { dbNumObj } from "../../../../../SectionMetas/relSections/rel/relValue/numObj";

const dbIds = {
  loan: "N0AANDr0HJQO",
  closingCostList: "Fq09_4YjPwu2",
  closingCostItem: "QvU2obumjI9c",
  wrappedInLoanList: "ASOq4_wO81ed",
} as const;

export const initLoanDefault: DbEntry = {
  dbId: dbIds.loan,
  dbSections: {
    loanDefault: [
      {
        dbId: dbIds.loan,
        dbVarbs: {
          title: "3.5% Down FHA",
          loanAmountBaseUnitSwitch: "percent",
          loanAmountBasePercent: dbNumObj("96.5"),
          loanAmountBaseDollars: dbNumObj("0"),
          loanAmountDollarsTotal: dbNumObj("0"),
          interestRatePercentMonthly: dbNumObj(".333"),
          interestRatePercentYearly: dbNumObj("4"),
          interestRatePercentOngoingSwitch: "yearly",
          loanTermMonths: dbNumObj("360"),
          loanTermYears: dbNumObj("30"),
          loanTermSpanSwitch: "years",
          piMonthly: dbNumObj("0"),
          piYearly: dbNumObj("0"),
          mortgageInsMonthly: dbNumObj("0"),
          mortgageInsYearly: dbNumObj("0"),
          mortgageInsOngoingSwitch: "yearly",
          mortInsUpfront: dbNumObj("0"), // this would have a formula
        },
        childDbIds: {
          closingCostList: [dbIds.closingCostList],
          wrappedInLoanList: [dbIds.wrappedInLoanList],
        },
      },
    ],
    closingCostList: [
      {
        dbId: dbIds.closingCostList,
        dbVarbs: {
          total: dbNumObj("6000"),
          title: "Closing Cost Items",
          defaultValueSwitch: "labeledEquation",
        },
        childDbIds: {
          singleTimeItem: [dbIds.closingCostItem],
        },
      },
    ],
    singleTimeItem: [
      {
        dbId: dbIds.closingCostItem,
        dbVarbs: {
          name: "All closing costs",
          editorValue: dbNumObj("6000"),
          value: dbNumObj("6000"),
          valueSwitch: "labeledEquation",
          sectionName: "",
          varbName: "",
          id: "",
          idType: "",
          entityId: "",
        },
        childDbIds: {},
      },
    ],
    wrappedInLoanList: [
      {
        dbId: dbIds.wrappedInLoanList,
        dbVarbs: {
          total: dbNumObj("0"),
          title: "Items wrapped in loan",
          defaultValueSwitch: "labeledEquation",
        },
        childDbIds: {
          singleTimeItem: [],
        },
      },
    ],
  },
};
