import { z } from "zod";

export const sectionNames = [
  "root",
  "main",
  "mainDealMenu",

  "variablesMenu",
  "feUserInfo",
  "feStore",
  "dbStore",
  "proxyStoreItem",
  "omniParent",
  "compareTable",
  "tableRow",
  "column",
  "cell",
  "conditionalRow",
  "singleTimeValue",
  "singleTimeValueGroup",
  "singleTimeList",
  "singleTimeItem",
  "ongoingValueGroup",
  "ongoingValue",
  "ongoingList",
  "ongoingItem",
  "outputList",
  "outputSection",

  "compareSection",
  "compareOption",
  "compareValue",

  "outputItem",
  "virtualVarb",

  "customVarb",
  "conditionalRowList",

  "numVarbList",
  "numVarbItem",

  "boolVarbList",
  "boolVarbItem",

  "calculatedVarbs",

  "deal",

  "propertyGeneral",
  "property",
  "repairValue",
  "utilityValue",

  "maintenanceValue",
  "capExValue",
  "capExList",
  "capExItem",
  "unit",

  "financing",
  "loan",
  "closingCostValue",
  "loanBaseValue",
  "downPaymentValue",

  "mgmtGeneral",
  "mgmt",
  "mgmtBasePayValue",
  "vacancyLossValue",

  "stripeSubscription",
  "stripeInfoPrivate",
  "userInfo",
  "userInfoPrivate",
  "authInfoPrivate",

  "dealPage",

  "userListEditor",
  "userVarbEditor",
  "latentSections",
  "activeSections",
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
