export type ExpectedCount = "onlyOne" | "multiple";
export interface ExpectedCountProp<EC extends ExpectedCount> {
  expectedCount: EC;
}

export interface GeneralMixedInfo<EC extends ExpectedCount = ExpectedCount>
  extends ExpectedCountProp<EC> {
  infoType: string;
}

export interface GeneralMixedIdInfo<EC extends ExpectedCount = ExpectedCount>
  extends GeneralMixedInfo<EC> {
  id: string;
}

export type NanoIdType = "dbId" | "feId";
export interface NanoIdInfo extends GeneralMixedIdInfo {
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
