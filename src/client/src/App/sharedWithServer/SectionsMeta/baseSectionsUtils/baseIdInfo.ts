export interface GeneralIdInfo {
  id: string;
  idType: string;
}

export type NanoIdType = "dbId" | "feId";
export interface NanoIdInfo extends GeneralIdInfo {
  idType: NanoIdType;
}

export interface DbIdInfo extends NanoIdInfo {
  id: string;
  idType: "dbId";
}
export interface FeIdInfo extends NanoIdInfo {
  id: string;
  idType: "feId";
}
