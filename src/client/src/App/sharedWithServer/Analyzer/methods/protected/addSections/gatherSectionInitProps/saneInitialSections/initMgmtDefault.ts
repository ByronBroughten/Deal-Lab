import { DbEntry } from "../../../../../DbEntry";
import { dbNumObj } from "../../../../../SectionMetas/relSections/rel/valueMeta/NumObj";

const dbIds = {
  mgmt: "fL2L7IN8agiG",
} as const;

export const initMgmtDefault: DbEntry = {
  dbId: dbIds.mgmt,
  dbSections: {
    mgmtDefault: [
      {
        dbId: dbIds.mgmt,
        dbVarbs: {
          title: "",
          rentCutUnitSwitch: "percent",
          rentCutPercent: dbNumObj(""),
          rentCutDollarsOngoingSwitch: "monthly",
          rentCutDollarsMonthly: dbNumObj("0"),
          rentCutDollarsYearly: dbNumObj("0"),
          vacancyRatePercent: dbNumObj(""),
          vacancyLossDollarsOngoingSwitch: "monthly",
          vacancyLossDollarsMonthly: dbNumObj("0"),
          vacancyLossDollarsYearly: dbNumObj("0"),
          upfrontExpenses: dbNumObj("0"),
          ongoingExpensesMonthly: dbNumObj("0"),
          ongoingExpensesYearly: dbNumObj("0"),
          ongoingExpensesOngoingSwitch: "monthly",
        },
        childDbIds: {
          upfrontCostList: [],
          ongoingCostList: [],
        },
      },
    ],
  },
};
