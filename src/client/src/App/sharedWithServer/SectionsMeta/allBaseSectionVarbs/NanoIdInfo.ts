import { MixedInfoProps } from "../baseSectionsDerived/baseVarbInfo";

type NanoIdType = "dbId" | "feId";
export interface NanoIdInfo extends MixedInfoProps<NanoIdType> {
  infoType: NanoIdType;
}

export interface NanoIdProp {
  id: string;
}
