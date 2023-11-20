import { Obj } from "../utils/Obj";
import { UnionValue } from "./values/StateValue/unionValues";

type TimespanEndings = Record<UnionValue<"timespan">, string>;
const checkTimespanEndings = <T extends TimespanEndings>(t: T) => t;
const timespanEndings = {
  months: "Months",
  years: "Years",
} as const;
checkTimespanEndings(timespanEndings);

type PeriodicEndings = Record<UnionValue<"periodic">, string>;
const checkPeriodicEndings = <T extends PeriodicEndings>(t: T) => t;
const periodicEndings = {
  monthly: "Monthly",
  yearly: "Yearly",
} as const;
checkPeriodicEndings(periodicEndings);

const groupNamesToEndings = {
  timespan: timespanEndings,
  periodic: periodicEndings,
} as const;
type GroupNamesToEndings = typeof groupNamesToEndings;

export type GroupName = keyof GroupNamesToEndings;
export type GroupKey<GN extends GroupName> = keyof GroupNamesToEndings[GN];
export type GroupVarbName<
  BN extends string,
  GN extends GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = `${BN}${GroupNamesToEndings[GN][GK] & string}`;
type GroupKeyToVarbNames<BN extends string, GN extends GroupName> = {
  [GK in GroupKey<GN>]: GroupVarbName<BN, GN, GK>;
};

export type GroupRecord<GN extends GroupName, O extends any> = Record<
  GroupKey<GN>,
  O
>;

export function groupKeys<GN extends GroupName>(groupName: GN): GroupKey<GN>[] {
  return Obj.keys(groupNamesToEndings[groupName]);
}

export function groupVarbName<
  BN extends string,
  GN extends GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
>(baseName: BN, groupName: GN, groupKey: GK): GroupVarbName<BN, GN, GK> {
  return `${baseName}${groupNamesToEndings[groupName][groupKey]}` as GroupVarbName<
    BN,
    GN,
    GK
  >;
}

// export function groupKeyToVarbNames<BN extends string, GN extends GroupName>(
//   baseName: BN,
//   groupName: GN
// ): GroupKeyToVarbNames<BN, GN> {
//   const keys = groupKeys(groupName);
//   return keys.reduce((keyToNames, key) => {
//     keyToNames[key] = groupVarbName(baseName, groupName, key);
//     return keyToNames;
//   }, {} as GroupKeyToVarbNames<BN, GN>);
// }

// export function groupVarbNames<BN extends string, GN extends GroupName>(
//   baseName: BN,
//   groupName: GN
// ): GroupVarbName<BN, GN>[] {
//   const keys = groupKeys(groupName);
//   return keys.map((key) => groupVarbName(baseName, groupName, key));
// }
