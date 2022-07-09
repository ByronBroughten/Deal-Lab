import { SimpleSectionName } from "../../baseSections";

export type UniqueIdType = "feId" | "dbId";

export interface UniqueIdMixedInfo<
  IDT extends UniqueIdType = UniqueIdType,
  SN extends SimpleSectionName = SimpleSectionName
> {
  sectionName: SN;
  id: string;
  infoType: IDT;
}
export interface UniqueIdMixedVarbInfo<
  IDT extends UniqueIdType = UniqueIdType,
  SN extends SimpleSectionName = SimpleSectionName
> extends UniqueIdMixedInfo<IDT, SN> {
  varbName: string;
}
