export type ExpectedCount = "onlyOne" | "multiple";
export interface GeneralInfo {
  infoType: string;
  expectedCount: ExpectedCount;
}

export interface GeneralIdInfo extends GeneralInfo {
  id: string;
}

export type NanoIdType = "dbId" | "feId";
export interface NanoIdInfo extends GeneralIdInfo {
  infoType: NanoIdType;
}

export interface DbIdInfo extends NanoIdInfo {
  id: string;
  infoType: "dbId";
}
export interface FeIdInfo extends NanoIdInfo {
  id: string;
  infoType: "feId";
}
