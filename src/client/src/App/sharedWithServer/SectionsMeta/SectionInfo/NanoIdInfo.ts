import { MixedInfoProps } from "./VarbInfoBase";

type NanoIdType = "dbId" | "feId";
export interface NanoIdInfo extends MixedInfoProps<NanoIdType> {
  infoType: NanoIdType;
}

export interface NanoIdProp {
  id: string;
}

export interface DbIdProp {
  dbId: string;
}
