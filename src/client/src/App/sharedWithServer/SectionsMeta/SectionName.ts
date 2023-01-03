import { z } from "zod";

export const sectionNames = [
  "root",
  "main",
  "feUser",
  "dbStore",
  "proxyStoreItem",
  "displayNameItem",
  "displayNameList",
  "omniParent",
  "compareTable",
  "tableRow",
  "column",
  "cell",
  "conditionalRow",
  "singleTimeValueGroup",
  "singleTimeValue",
  "singleTimeList",
  "singleTimeItem",
  "ongoingValueGroup",
  "ongoingValue",
  "ongoingList",
  "ongoingItem",
  "outputList",
  "outputItem",
  "customVarb",
  "userVarbItem",
  "conditionalRowList",
  "userVarbList",

  "deal",

  "propertyGeneral",
  "property",

  "unit",
  "financing",
  "loan",

  "mgmtGeneral",
  "mgmt",

  "stripeSubscription",
  "stripeInfoPrivate",
  "userInfo",
  "userInfoPrivate",
  "authInfoPrivate",

  "userListEditor",
  "userVarbEditor",
  "latentSections",
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
