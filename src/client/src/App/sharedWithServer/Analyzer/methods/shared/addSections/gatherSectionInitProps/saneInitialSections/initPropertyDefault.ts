import { makeSectionId } from "../../../../../../makeSectionId";
import { Obj } from "../../../../../../utils/Obj";
import { DbEnt, DbEntry, DbSection } from "../../../../../DbEntry";
import { Inf } from "../../../../../SectionMetas/Info";
import { dbNumObj } from "../../../../../SectionMetas/relSections/rel/valueMeta/NumObj";

type ListItemCoreValues = [name: string, cost: number];
const periodicItemCoreValues: ListItemCoreValues[] = [
  // ["Misc repairs", 200],
  // ["Energy", 80],
  // ["Lawncare", 30],
  // ["Water", 120],
  // ["Garbage", 120],
];
const periodicItemSections = [...periodicItemCoreValues]
  .reverse()
  .map(([name, monthlyCost]) => ({
    name,
    valueSwitch: "labeledEquation",
    editorValue: dbNumObj(monthlyCost),
    valueMonthly: dbNumObj(monthlyCost),
    valueOngoingSwitch: "monthly",
  }))
  .map((values) => DbEnt.initSection(makeSectionId(), values));

const miscUpfrontItemCoreValues: ListItemCoreValues[] = [
  // ["Inspection", 600]
];
const miscUpfrontSections = [...miscUpfrontItemCoreValues]
  .reverse()
  .map(([name, cost]) => ({
    name,
    valueSwitch: "labeledEquation",
    editorValue: dbNumObj(cost),
    value: dbNumObj(cost),
  }))
  .map((values) => DbEnt.initSection(makeSectionId(), values));

type CapExItemCoreValues = [
  name: string,
  costToReplace: number,
  lifespan: number
];
const capExItemCoreValues: CapExItemCoreValues[] = [
  // ["Furnace", 4000, 20],
  // ["Water heater", 1200, 12],
  // ["Floors", 6000, 10],
  // ["Roof", 8000, 20],
  // ["Plumbing (PEX)", 6000, 50],
  // ["Trees/landscaping", 2000, 10],
  // ["Foundation", 10000, 50],
  // ["Siding", 6000, 40],
  // ["Windows", 6000, 50],
  // ["Cabinets/Counters", 5000, 30],
  // ["Laundry", 1200, 12],
  // ["Driveway", 5000, 30],
];
const capExItemSections = [...capExItemCoreValues]
  .reverse()
  .map(([name, costToReplace, lifespanYears]) => ({
    name,
    valueSwitch: "labeledSpanOverCost",
    costToReplace: dbNumObj(costToReplace),

    lifespanYears: dbNumObj(lifespanYears),
    lifespanSpanSwitch: "years",
    valueOngoingSwitch: "yearly",
  }))
  .map((values) => DbEnt.initSection(makeSectionId(), values));

let capExList = DbEnt.initEntry(
  "ongoingCostList",
  { title: "CapEx", totalOngoingSwitch: "yearly" },
  { dbId: makeSectionId() }
);
capExList = DbEnt.addLikeChildren(
  capExList,
  capExItemSections,
  "ongoingItem",
  Inf.db("ongoingCostList", capExList.dbId)
);

let periodicPaymentList = DbEnt.initEntry(
  "ongoingCostList",
  { title: "Utilities" },
  { dbId: makeSectionId() }
);
periodicPaymentList = DbEnt.addLikeChildren(
  periodicPaymentList,
  periodicItemSections,
  "ongoingItem",
  Inf.db("ongoingCostList", periodicPaymentList.dbId)
);

let miscUpfrontCostList = DbEnt.initEntry(
  "upfrontCostList",
  { title: "Misc" },
  { dbId: makeSectionId() }
);
miscUpfrontCostList = DbEnt.addLikeChildren(
  miscUpfrontCostList,
  miscUpfrontSections,
  "singleTimeItem",
  Inf.db("upfrontCostList", miscUpfrontCostList.dbId)
);

const dbIds = {
  property: "0Qm-bLBiulvp",
  unit1: makeSectionId(),
  unit2: makeSectionId(),
  repairList: makeSectionId(),
} as const;

const init: DbEntry = {
  dbId: dbIds.property,
  dbSections: {
    propertyDefault: [
      {
        dbId: dbIds.property,
        dbVarbs: {
          title: "",
          price: dbNumObj(""),
          sqft: dbNumObj(""),
          taxesMonthly: dbNumObj(""),
          taxesYearly: dbNumObj(""),
          taxesOngoingSwitch: "yearly",
          homeInsMonthly: dbNumObj(""),
          homeInsYearly: dbNumObj(""),
          homeInsOngoingSwitch: "yearly",
          numUnits: dbNumObj(""),
          numBedrooms: dbNumObj(""),
          upfrontExpenses: dbNumObj("0"),
          upfrontRevenue: dbNumObj("0"),
          ongoingExpensesMonthly: dbNumObj("0"),
          ongoingExpensesYearly: dbNumObj("0"),
          ongoingExpensesOngoingSwitch: "yearly",
          targetRentMonthly: dbNumObj("0"),
          targetRentYearly: dbNumObj("0"),
          targetRentOngoingSwitch: "monthly",
          miscOngoingRevenueMonthly: dbNumObj("0"),
          miscOngoingRevenueYearly: dbNumObj("0"),
          miscOngoingRevenueOngoingSwitch: "monthly",
          ongoingRevenueMonthly: dbNumObj("0"),
          ongoingRevenueYearly: dbNumObj("0"),
          ongoingRevenueOngoingSwitch: "monthly",
        },
        childDbIds: {
          upfrontCostList: [dbIds.repairList],
          upfrontRevenueList: [],
          ongoingCostList: [],
          ongoingRevenueList: [],
          unit: [], // dbIds.unit1, dbIds.unit2
        },
      },
    ],
    unit: [
      // {
      //   dbId: dbIds.unit1,
      //   dbVarbs: {
      //     one: dbNumObj("1"),
      //     numBedrooms: dbNumObj("3"),
      //     targetRentMonthly: dbNumObj("1500"),
      //     targetRentYearly: dbNumObj("18000"),
      //   },
      //   childDbIds: {},
      // },
      // {
      //   dbId: dbIds.unit2,
      //   dbVarbs: {
      //     one: dbNumObj("1"),
      //     numBedrooms: dbNumObj("3"),
      //     targetRentMonthly: dbNumObj("1500"),
      //     targetRentYearly: dbNumObj("18000"),
      //   },
      //   childDbIds: {},
      // },
    ],
    upfrontCostList: [
      DbEnt.initSection(dbIds.repairList, { title: "Repairs" }),
    ],
  },
};

for (const sectionName of Obj.keys(periodicPaymentList.dbSections)) {
  if (!init.dbSections[sectionName]) init.dbSections[sectionName] = [];
  // @ts-ignore
  init.dbSections[sectionName].push(
    // @ts-ignore
    ...periodicPaymentList.dbSections[sectionName],
    ...capExList.dbSections[sectionName]
  );
}
// @ts-ignore
init.dbSections.propertyDefault[0].childDbIds.ongoingCostList.push(
  periodicPaymentList.dbId,
  capExList.dbId
);

// for (const sectionName of Obj.keys(miscUpfrontCostList.dbSections)) {
//   if (!init.dbSections[sectionName]) init.dbSections[sectionName] = [];
//   // @ts-ignore
//   init.dbSections[sectionName].push(
//     ...miscUpfrontCostList.dbSections[sectionName]
//   );
// }
// // @ts-ignore
// init.dbSections.propertyDefault[0].childDbIds.upfrontCostList.push(
//   miscUpfrontCostList.dbId
// );

export const initPropertyDefault = init;
