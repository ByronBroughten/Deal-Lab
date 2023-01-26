import { numObj } from "../../SectionsMeta/allBaseSectionVarbs/baseValues/NumObj";
import { numObjNext } from "../../SectionsMeta/allBaseSectionVarbs/baseValues/numObjNext";

export const userVarbLifespans = {
  roof: ["Roof", numObj(12)],
  waterHeater: ["Water heater", numObj(12)],
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

export const examplePropertyCapExListProps = [
  [...userVarbLifespans.roof, numObj(8000)],
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

export const blankPropertyUtilityProps = [
  ["Water", numObj("")],
  ["Garbage", numObj("")],
  ["Heat", numObj("")],
  ["Electricity", numObj("")],
] as const;

export const exampleUserUtilityProps = [
  ...examplePropertyUtilityProps,
  ["Energy", numObjNext("120*", ["numUnits"])],
] as const;

export const priceSqftMiscRepairHybrid = numObjNext(
  "(",
  ["onePercentPrice"],
  "+",
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
