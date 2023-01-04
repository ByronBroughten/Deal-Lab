import { numObjNext } from "../../SectionsMeta/baseSectionsVarbs/baseValues/numObjNext";

export const userVarbLifespans = {
  roof: ["Roof", 12],
  waterHeater: ["Water heater", 12],
  hvac: ["HVAC", 20],
  interiorPaint: ["Interior paint", 10],
  windows: ["Windows", 50],
  siding: ["Siding", 9000],
  appliances: ["Appliances", 10],
  plumbing: ["Plumbing", 50],
  driveway: ["Driveway", 50],
  laundry: ["Laundry", 12],
  flooring: ["Flooring", 20],
  structure: ["Structure", 50],
  cabinetsCounters: ["Cabinets/counters", 20],
  garageDoor: ["Garage door", 10],
  landscaping: ["Landscaping", 10],
} as const;

export const examplePropertyCapExListProps = [
  [...userVarbLifespans.roof, numObjNext(8000)],
  [...userVarbLifespans.waterHeater, numObjNext("1200*", ["numUnits"])],
  [...userVarbLifespans.hvac, numObjNext("3500*", ["numUnits"])],
  [...userVarbLifespans.interiorPaint, numObjNext(["sqft"], "*3")],
  [...userVarbLifespans.windows, numObjNext("(5+2*", ["numBedrooms"], ")*500")],
  [...userVarbLifespans.siding, numObjNext(["sqft"], "*4")],
  [...userVarbLifespans.appliances, numObjNext("550+715")],
  [...userVarbLifespans.plumbing, numObjNext("5000*", ["numUnits"])],
  [...userVarbLifespans.flooring, numObjNext(["sqft"], "*3")],
  [...userVarbLifespans.structure, numObjNext(10000)],
  [...userVarbLifespans.cabinetsCounters, numObjNext("4000*", ["numUnits"])],
  [...userVarbLifespans.landscaping, numObjNext(1000)],
] as const;

export const exampleUserCapExProps = [
  ...examplePropertyCapExListProps,
  [...userVarbLifespans.laundry, numObjNext(1200)],
  [...userVarbLifespans.driveway, numObjNext(5000)],
  [...userVarbLifespans.garageDoor, numObjNext(1000)],
] as const;

export const examplePropertyUtilityProps = [
  ["Water", numObjNext("60*", ["numUnits"])],
  ["Garbage", numObjNext("40*", ["numUnits"])],
  ["LawnCare", numObjNext(20)],
] as const;

export const exampleUserUtilityProps = [
  ...examplePropertyUtilityProps,
  ["Energy", numObjNext("120*", ["numUnits"])],
] as const;

export const priceSqftMiscRepairHybrid = numObjNext(
  "(",
  ["price"],
  "*.01+", // this should maybe be .005...
  ["sqft"],
  ")/2"
);

export const userRepairVarbProps = [
  ["Inspection", 500],
  ["Change locks", 120],
  ["Entryway mats", 100],
  ["Radon test", 200],
] as const;

export const examplePropetyRepairProps = [
  ...userRepairVarbProps,
  ["Replace toilet", 200],
  ["Pest control", 200],
] as const;
