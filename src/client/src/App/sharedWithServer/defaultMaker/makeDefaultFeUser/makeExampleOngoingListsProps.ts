import { NumObj, numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";

const userVarbCapExNames = {
  roof: "Roof",
  waterHeater: "Water heater",
  hvac: "HVAC",
  interiorPaint: "Interior paint",
  windows: "Windows",
  siding: "Siding",
  appliances: "Appliances",
  plumbing: "Plumbing",
  driveway: "Driveway",
  laundry: "Laundry",
  flooring: "Flooring",
  structure: "Structure",
  cabinetsCounters: "Cabinets/counters",
  garageDoor: "Garage door",
  landscaping: "Landscaping",
} as const;

const names = userVarbCapExNames;
export const userVarbLifespans = {
  roof: [names.roof, numObj(12)],
  waterHeater: [names.waterHeater, numObj(12)],
  hvac: ["HVAC", numObj(20)],
  interiorPaint: ["Interior paint", numObj(10)],
  windows: ["Windows", numObj(50)],
  siding: ["Siding", numObj(9000)],
  appliances: ["Appliances", numObj(10)],
  plumbing: ["Plumbing", numObj(50)],
  driveway: ["Driveway", numObj(50)],
  laundry: ["Laundry", numObj(12)],
  flooring: ["Flooring", numObj(20)],
  structure: ["Structure", numObj(50)],
  cabinetsCounters: ["Cabinets/counters", numObj(20)],
  garageDoor: ["Garage door", numObj(10)],
  landscaping: ["Landscaping", numObj(10)],
} as const;

const spans = userVarbLifespans;

export const defaultPropertyCapExListProps = [
  [names.roof, numObj(), numObj()],
  [names.waterHeater, numObj(), numObj()],
  [names.hvac, numObj(), numObj()],
  [names.interiorPaint, numObj(), numObj()],
  [names.windows, numObj(), numObj()],
  [names.siding, numObj(), numObj()],
  [names.appliances, numObj(), numObj()],
  [names.plumbing, numObj(), numObj()],
  [names.flooring, numObj(), numObj()],
  [names.structure, numObj(), numObj()],
  [names.cabinetsCounters, numObj(), numObj()],
  [names.landscaping, numObj(), numObj()],
] as const;

export const examplePropertyCapExListProps: [
  string,
  number | NumObj,
  number | NumObj
][] = [
  [...spans.roof, numObj(8000)],
  [...spans.waterHeater, numObjNext("1200*", ["numUnits"])],
  [...spans.hvac, numObjNext("3500*", ["numUnits"])],
  [...spans.interiorPaint, numObjNext(["sqft"], "*3")],
  [...spans.windows, numObjNext("(5+2*", ["numBedrooms"], ")*500")],
  [...spans.siding, numObjNext(["sqft"], "*4")],
  [...spans.appliances, numObjNext("550+715")],
  [...spans.plumbing, numObjNext("5000*", ["numUnits"])],
  [...spans.flooring, numObjNext(["sqft"], "*3")],
  [...spans.structure, numObjNext(10000)],
  [...spans.cabinetsCounters, numObjNext("4000*", ["numUnits"])],
  [...spans.landscaping, numObjNext(1000)],
];

export const exampleUserCapExProps: [
  string,
  number | NumObj,
  number | NumObj
][] = [
  ...examplePropertyCapExListProps,
  [...userVarbLifespans.laundry, numObjNext(1200)],
  [...userVarbLifespans.driveway, numObjNext(5000)],
  [...userVarbLifespans.garageDoor, numObjNext(1000)],
];

export const examplePropertyUtilityProps: [string, number | NumObj][] = [
  ["Water", numObjNext("60*", ["numUnits"])],
  ["Garbage", numObjNext("40*", ["numUnits"])],
  ["LawnCare", numObjNext(20)],
];

export const blankPropertyUtilityProps: [string, number | NumObj][] = [
  ["Water", numObj("")],
  ["Garbage", numObj("")],
  ["Heat", numObj("")],
  ["Electricity", numObj("")],
];

export const exampleUserUtilityProps: [string, number | NumObj][] = [
  ...examplePropertyUtilityProps,
  ["Energy", numObjNext("120*", ["numUnits"])],
];

export const priceSqftMiscRepairHybrid = numObjNext(
  "(",
  ["onePercentPrice"],
  "+",
  ["sqft"],
  ")/2"
);

export const userRepairVarbProps: [string, number | NumObj][] = [
  ["Inspection", 500],
  ["Change locks", 120],
  ["Entryway mats", 100],
  ["Radon test", 200],
];

export const examplePropertyRepairProps: [string, number | NumObj][] = [
  ...userRepairVarbProps,
  ["Replace toilet", 200],
  ["Pest control", 200],
];
