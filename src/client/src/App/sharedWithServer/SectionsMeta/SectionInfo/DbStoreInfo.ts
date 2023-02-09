import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import {
  DbSectionName,
  DbStoreName,
} from "../sectionChildrenDerived/DbStoreName";
import { SectionName } from "../SectionName";
import { VarbValue } from "../values/StateValue";

export type OneDbSectionVarbInfo<
  CN extends DbStoreName,
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: VN;
};

export type OneDbVarbInfo<
  CN extends DbStoreName,
  VN extends VarbName<SN>,
  SN extends DbSectionName<CN> = DbSectionName<CN>
> = {
  storeName: CN;
  varbName: VN;
};

export interface OneDbSectionValueInfo<
  CN extends DbStoreName = DbStoreName,
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends OneDbSectionVarbInfo<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}
