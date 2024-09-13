import {
  GroupKey,
  GroupName,
  GroupRecord,
} from "../../sharedWithServer/stateSchemas/schema3SectionStructures/GroupName";

export const periodicEndAdornments: GroupRecord<"periodic", string> = {
  monthly: "/month",
  yearly: "/year",
};

type GroupAdornments<GN extends GroupName> = GroupRecord<GN, string>;

type AllGroupAdornmentsGen = {
  [GN in GroupName]: GroupAdornments<GN>;
};
const checkGroupAdornments = <T extends AllGroupAdornmentsGen>(t: T) => t;

const groupEndAdornments = checkGroupAdornments({
  periodic: {
    monthly: "/month",
    yearly: "/year",
  },
  timespan: {
    months: " months",
    years: " years",
  },
} as const);
type AllGroupAdornments = typeof groupEndAdornments;

export function groupAdornment<GN extends GroupName, GK extends GroupKey<GN>>(
  groupName: GN,
  groupKey: GK
): AllGroupAdornments[GN][GK & keyof AllGroupAdornments[GN]] {
  return (groupEndAdornments as any)[groupName][groupKey];
}
