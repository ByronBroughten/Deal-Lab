import { SectionVarbName } from "../baseSectionsDerived/baseSectionTypes";
import { VarbValue } from "../baseSectionsDerived/valueMetaTypes";
import { DbSelfOrDescendantSn, DbStoreName } from "./DbStoreName";

export type OneDbSectionVarbInfo<
  CN extends DbStoreName,
  SN extends DbSelfOrDescendantSn<CN>,
  VN extends SectionVarbName<SN> = SectionVarbName<SN>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: VN;
};

export interface OneDbSectionValueInfo<
  CN extends DbStoreName=DbStoreName,
  SN extends DbSelfOrDescendantSn<CN>=DbSelfOrDescendantSn<CN>,
  VN extends SectionVarbName<SN>=SectionVarbName<SN>
> extends OneDbSectionVarbInfo<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}
