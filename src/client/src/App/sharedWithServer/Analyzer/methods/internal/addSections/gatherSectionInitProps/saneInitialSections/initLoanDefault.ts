import { dbNumObj } from "../../../../../../SectionsMeta/baseSections/baseValues/NumObj";
import { DbEntry } from "../../../../../DbEntry";

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
          title: "",
          loanAmountBaseUnitSwitch: "percent",
          loanAmountBasePercent: dbNumObj(""),
          loanAmountBaseDollars: dbNumObj("0"),
          loanAmountDollarsTotal: dbNumObj("0"),
          interestRatePercentMonthly: dbNumObj(""),
          interestRatePercentYearly: dbNumObj(""),
          interestRatePercentOngoingSwitch: "yearly",
          loanTermMonths: dbNumObj(""),
          loanTermYears: dbNumObj(""),
          loanTermSpanSwitch: "years",
          piMonthly: dbNumObj("0"),
          piYearly: dbNumObj("0"),
          mortgageInsMonthly: dbNumObj(""),
          mortgageInsYearly: dbNumObj(""),
          mortgageInsOngoingSwitch: "yearly",
          mortInsUpfront: dbNumObj(""), // this would have a formula
        },
        childDbIds: {
          closingCostList: [dbIds.closingCostList],
          wrappedInLoanList: [
            // dbIds.wrappedInLoanList
          ],
        },
      },
    ],
    closingCostList: [
      {
        dbId: dbIds.closingCostList,
        dbVarbs: {
          total: dbNumObj(""),
          title: "Closing Costs",
          defaultValueSwitch: "labeledEquation",
        },
        childDbIds: {
          singleTimeItem: [
            // dbIds.closingCostItem
          ],
        },
      },
    ],
    singleTimeItem: [
      // {
      //   dbId: dbIds.closingCostItem,
      //   dbVarbs: {
      //     name: "All closing costs",
      //     editorValue: dbNumObj("6000"),
      //     value: dbNumObj("6000"),
      //     valueSwitch: "labeledEquation",
      //     sectionName: "",
      //     varbName: "",
      //     id: "",
      //     idType: "",
      //     entityId: "",
      //   },
      //   childDbIds: {},
      // },
    ],
    // wrappedInLoanList: [
    //   {
    //     dbId: dbIds.wrappedInLoanList,
    //     dbVarbs: {
    //       total: dbNumObj("0"),
    //       title: "Items wrapped in loan",
    //       defaultValueSwitch: "labeledEquation",
    //     },
    //     childDbIds: {
    //       singleTimeItem: [],
    //     },
    //   },
    // ],
  },
};
