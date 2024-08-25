import { capitalizeFirstLetter } from "../utils/Str";

const groupNameToKeys = {
  periodic: ["monthly", "yearly"],
  timespan: ["months", "years"],
} as const;
type GroupNameToKeys = typeof groupNameToKeys;
export function groupKeys<GN extends GroupName>(
  groupName: GN
): readonly GroupKey<GN>[] {
  return groupNameToKeys[groupName];
}

export type GroupName = keyof GroupNameToKeys;
export type GroupKey<GN extends GroupName> = GroupNameToKeys[GN][number];

export type GroupNameEnding<
  GN extends GroupName = GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = Capitalize<GK>;

export function groupNameEnding<GN extends GroupName, GK extends GroupKey<GN>>(
  _groupName: GN,
  groupKey: GK
): GroupNameEnding<GN, GK> {
  return capitalizeFirstLetter(groupKey);
}

export function periodicEnding<GK extends GroupKey<"periodic">>(
  groupKey: GK
): GroupNameEnding<"periodic", GK> {
  return groupNameEnding("periodic", groupKey);
}

const _test: "Monthly" = groupNameEnding("periodic", "monthly");

export type GroupBaseVarbName<
  BN extends string,
  GN extends GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = `${BN}${GroupNameEnding<GN, GK> & string}`;

export type GroupVNGeneral<
  GN extends GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = keyof {
  [GE in GroupNameEnding<GN, GK> as `${string}${GE}`]: any;
};

export type GroupRecord<GN extends GroupName, O extends any> = Record<
  GroupKey<GN>,
  O
>;
export type GroupRecordAndAll<GN extends GroupName, O extends any> = Record<
  GroupKey<GN> | "all",
  O
>;

export function groupVarbName<
  BN extends string,
  GN extends GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
>(baseName: BN, groupName: GN, groupKey: GK): GroupBaseVarbName<BN, GN, GK> {
  return `${baseName}${groupNameEnding(
    groupName,
    groupKey
  )}` as GroupBaseVarbName<BN, GN, GK>;
}
export function periodicName<
  BN extends string,
  GK extends GroupKey<"periodic">
>(baseName: BN, groupKey: GK): GroupBaseVarbName<BN, "periodic", GK> {
  return groupVarbName(baseName, "periodic", groupKey);
}
export function timespanName<
  BN extends string,
  GK extends GroupKey<"timespan">
>(baseName: BN, groupKey: GK): GroupBaseVarbName<BN, "timespan", GK> {
  return groupVarbName(baseName, "timespan", groupKey);
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
// ): GroupBaseVarbName<BN, GN>[] {
//   const keys = groupKeys(groupName);
//   return keys.map((key) => groupVarbName(baseName, groupName, key));
// }
