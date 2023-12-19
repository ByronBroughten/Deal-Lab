import { NumObj, numObj } from "../sectionVarbsConfig/StateValue/NumObj";
import { numObjNext } from "../sectionVarbsConfig/StateValue/numObjNext";
import { Obj } from "../utils/Obj";

export type ExampleCapExProps = [string, number | NumObj, number | NumObj][];

type CapExName = (typeof capExNames)[number];
const capExNames = [
  "roof",
  "siding",
  "gutters",
  "windows",
  "furnace",
  "waterHeater",
  "interiorPaint",
  "cabinets",
  "countertops",
  "refrigerator",
  "range",
  "dishwasher",
  "flooring",
  // "plumbing",
  // "foundation",
  // "electrical"
  "landscaping",
  "laundry",
  "centralAc",
  "driveway",
  "garageDoor",
] as const;

const capExDisplayNameMap: Record<CapExName, string> = {
  roof: "Roof",
  siding: "Siding",
  windows: "Windows",
  furnace: "Furnace",
  centralAc: "Central AC",
  waterHeater: "Water heater",
  interiorPaint: "Interior paint",
  cabinets: "Cabinets",
  countertops: "Countertops",
  refrigerator: "Refrigerator",
  range: "Range",
  dishwasher: "Dish washer",
  flooring: "Flooring",
  landscaping: "Landscaping",
  laundry: "Laundry",
  driveway: "Driveway",
  garageDoor: "Garage door",
  gutters: "Gutters",
};

export const capExDisplayNames = Obj.values(capExDisplayNameMap);

const capExNahbLifespans: Record<CapExName, number> = {
  roof: 20,
  siding: 30, // nahb says it lasts forever, but I dunno
  windows: 30,
  furnace: 18,
  waterHeater: 10,
  interiorPaint: 15,
  cabinets: 50,
  countertops: 20,
  refrigerator: 13,
  range: 15,
  dishwasher: 9,
  flooring: 50, // Vinyl, allegedly
  landscaping: 18,
  laundry: 13,
  centralAc: 13,
  driveway: 18,
  garageDoor: 30, // nahb doesn't say, but The Book on Estimating Rehab Costs says 20-30
  gutters: 20, // aluminum ones, most common
};

// It would be nice to have "lowHomeAdvisorCosts" too, or something.
const averageHomeAdvisorCosts2023: Record<CapExName, NumObj | number> = {
  roof: 9154,
  siding: 10750,
  windows: 6831,
  furnace: 4719,
  centralAc: 5887,
  waterHeater: 1285,
  interiorPaint: numObjNext("3.5*", ["sqft"]),
  cabinets: 5435,
  countertops: 3107,
  refrigerator: 1500,
  range: 2000,
  dishwasher: 970,
  flooring: numObjNext("12.5*", ["sqft"]),
  // plumbing: 7500 — PVC plumbing essentially lasts forever, 100 years
  // foundation: 9084 — "should" last a lifetime if done properly
  landscaping: 3423,
  laundry: 1372 + 1272.5,
  // washer 445 - 2300 (median 1372), dryer 445 - 2100 = 1272.5,
  // https://www.homeadvisor.com/cost/appliances/
  driveway: 4760,
  garageDoor: 1193,
  gutters: 1600, // 1200 for single-story, 2000 for two story, allegedly
};

export const avgHomeAdvisorNahbCapExProps = capExNames.reduce((props, name) => {
  props.push([
    capExDisplayNameMap[name],
    capExNahbLifespans[name],
    averageHomeAdvisorCosts2023[name],
  ]);
  return props;
}, [] as ExampleCapExProps);

const myCosts = {
  roof: 8000,
  waterHeater: 1200,
  furnace: numObjNext("5000*", ["numUnits"]),
  interiorPaint: numObjNext(["sqft"], "*3"), // refer to Jesus
  windows: numObjNext("(4+2*", ["numBedrooms"], ")*500"), // refer to Jesus
  siding: numObjNext(["sqft"], "*4"), // ?
  range: 450,
  refrigerator: 450,
  flooring: numObjNext(["sqft"], "*3"),
  cabinets: numObjNext("2000*", ["numUnits"]),
  counters: numObjNext("2000*", ["numUnits"]),
  landscaping: numObjNext(1000),
  laundry: numObjNext(1200),
  driveway: numObjNext(5000),
  garageDoor: numObjNext(1000),
};

const myLifespans = {
  siding: 50,
  windows: 50,
  interiorPaint: 10,
  kitchenAppliances: 10,
  driveway: 50,
  laundry: 12,
  flooring: 20,
  cabinetsCounters: 20,
  garageDoor: 10,
  landscaping: 10,
};

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
