import { z } from "zod";

export const sectionNames = [
  "root",
  "main",
  "feUser",
  "dbStore",
  "proxy",
  "displayNameItem",
  "displayNameList",
  "omniParent",
  "compareTable",
  "tableRow",
  "column",
  "cell",
  "conditionalRow",
  "singleTimeListGroup",
  "singleTimeList",
  "ongoingListGroup",
  "ongoingList",
  "singleTimeItem",
  "ongoingItem",
  "outputList",
  "outputItem",
  "customVarb",
  "userVarbItem",
  "conditionalRowList",
  "userVarbList",

  "deal",
  "dealDisplayStore",

  "propertyGeneral",
  "property",
  "propertyDisplayStore",

  "unit",
  "financing",
  "loan",
  "loanDisplayStore",

  "mgmtGeneral",
  "mgmt",
  "mgmtDisplayStore",

  "subscriptionInfo",
  "stripeSubscription",
  "stripeInfoPrivate",

  "authInfo",
  "authInfoPrivate",

  "userInfo",
  "userInfoPrivate",
] as const;

export type SectionName = typeof sectionNames[number];
export function isSectionName(value: any): value is SectionName {
  return sectionNames.includes(value);
}
export const zSectionName = z
  .string()
  .refine((str) => isSectionName(str), "Not a valid sectionName");

export const sectionNamesToNull = sectionNames.reduce((toNull, sectionName) => {
  toNull[sectionName] = null;
  return toNull;
}, {} as Record<SectionName, null>);
