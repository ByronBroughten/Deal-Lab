import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";

const varbsCommonRepairs = [
  ["swap toilet hardware", 30],
  ["change deadbolt", 20],
  ["add smoke detector", 15],
  ["install outlet", 30],
];

const varbsReplacementCosts = [
  ["vinyl plank per sqft", 3],
  ["furnace", 3500],
  ["water heater", 1200],
  ["window", 500],
  ["stove", 600],
  ["refrigerator", 800],
  ["laundry", 1200],
  ["roof", 8000],
];

const varbsLifespans = {
  roof: ["roof", 12],
  waterHeater: ["water heater", 12],
  hvac: ["HVAC", 20],
  interiorPaint: ["interior paint", 10],
  windows: ["windows", 50],
  siding: ["siding", 9000],
  appliances: ["appliances", 10],
  plumbing: ["plumbing", 50],
  driveway: ["driveway", 50],
  laundry: ["laundry", 12],
  flooring: ["flooring", 20],
  structure: ["structure", 50],
  cabinetsCounters: ["cabinets/counters", 20],
  garageDoor: ["garage door", 10],
  landscaping: ["landscaping", 10],
} as const;

export const capExValues = [
  [...varbsLifespans.roof, numObj(8000)],
  [...varbsLifespans.waterHeater, numObj(1200)], // unitCount * 1200
  [...varbsLifespans.hvac, numObj(4000)], // unitCount * 4000
  [...varbsLifespans.interiorPaint, numObj(5000)], // sqft * 3
  [...varbsLifespans.windows, numObj(500)], // 5 + (bedroom count * 2)
  [...varbsLifespans.siding, numObj(9000)], // 3 * sqft?
  [...varbsLifespans.appliances, numObj(550 + 715)],
  [...varbsLifespans.plumbing, numObj(10000)], // 5000 * unitCount
  [...varbsLifespans.driveway, numObj(5000)],
  [...varbsLifespans.laundry, numObj(1200)],
  [...varbsLifespans.flooring, numObj(5000)], // sqft * 3
  [...varbsLifespans.structure, numObj(10000)],
  [...varbsLifespans.cabinetsCounters, numObj(8000)],
  [...varbsLifespans.garageDoor, numObj(1000)],
  [...varbsLifespans.landscaping, numObj(1000)],
] as const;

export const utilityExamples = [
  ["water", 100], // (88/3) * bedroom count
  ["garbage", 75], // (60/3) * bedroom count
  ["energy", 100], //
  ["lawnCare", 20],
] as const;

export const commonCostExamples = [
  ["inspection", 500],
  ["change all locks", 120],
  ["entryway mats", 100],
  ["radon test", 200],
] as const;

export const closingCostsExamples = [] as const;

export const miscOngoingRepairs = "((Price*.005+sqft)/2)/12";
