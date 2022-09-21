import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";

// the text for global variables must come from the varbMeta
export const capExValues = [
  ["roof", 20, numObj(8000)],
  ["water heater", 12, numObj(1200)], // unitCount * 1200
  ["HVAC", 20, numObj(4000)], // unitCount * 4000
  ["interior paint", 10, numObj(5000)], // sqft * 3
  ["windows", 50, numObj(500)], // 5 + (bedroom count * 2)
  ["siding", 50, numObj(9000)], // 3 * sqft?
  ["appliances", 10, numObj(550 + 715)],
  ["plumbing", 50, numObj(10000)], // 5000 * unitCount
  ["driveway", 50, numObj(5000)],
  ["laundry", 12, numObj(1200)],
  ["flooring", 20, numObj(5000)], // sqft * 3
  ["structure", 50, numObj(10000)],
  ["cabinets/counters", 20, numObj(8000)],
  ["garage door", 10, numObj(1000)],
  ["landscaping", 10, numObj(1000)],
] as const;

export const utilityValues = [
  ["water", 100], // (88/3) * bedroom count
  ["garbage", 100], // (60/3) * bedroom count
  ["energy", 100], //
] as const;

export const miscOngoingRepairs = "((Price*.005+sqft)/2)/12";
