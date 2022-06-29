export interface GeneralIdInfo {
  id: string;
  idType: string;
}

export type BaseIdType = "dbId" | "feId";
interface BaseIdInfo extends GeneralIdInfo {
  idType: BaseIdType;
}

export interface DbIdInfo extends BaseIdInfo {
  id: string;
  idType: "dbId";
}
export interface FeIdInfo extends BaseIdInfo {
  id: string;
  idType: "feId";
}

export interface NanoIdInfo {
  id: string;
  idType: BaseIdType;
}
