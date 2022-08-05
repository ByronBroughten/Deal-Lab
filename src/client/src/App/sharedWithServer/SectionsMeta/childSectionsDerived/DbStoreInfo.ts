import { SectionVarbName } from "../baseSectionsDerived/baseSectionTypes";
import { VarbValue } from "../baseSectionsUtils/valueMetaTypes";
import { DbSelfOrDescendantSn, DbStoreName } from "./DbStoreName";

export type OneDbSectionVarbInfo<
  CN extends DbStoreName,
  SN extends DbSelfOrDescendantSn<CN>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: SectionVarbName<SN>;
};

export interface UpdateVarbProps<
  CN extends DbStoreName,
  SN extends DbSelfOrDescendantSn<CN>,
  VN extends SectionVarbName<SN>
> extends OneDbSectionVarbInfo<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}
