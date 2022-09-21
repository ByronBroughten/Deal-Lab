import { VarbNameNext } from "../baseSectionsDerived/baseSectionTypes";
import { VarbValue } from "../baseSectionsDerived/valueMetaTypes";
import {
  DbSectionName,
  DbSelfOrDescendantSn,
  DbStoreName,
} from "./DbStoreName";

export type OneDbSectionVarbInfo<
  CN extends DbStoreName,
  SN extends DbSelfOrDescendantSn<CN>,
  VN extends VarbNameNext<SN> = VarbNameNext<SN>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: VN;
};

export type OneDbVarbInfo<
  CN extends DbStoreName,
  VN extends VarbNameNext<SN>,
  SN extends DbSectionName<CN> = DbSectionName<CN>
> = {
  storeName: CN;
  varbName: VN;
};

export interface OneDbSectionValueInfo<
  CN extends DbStoreName = DbStoreName,
  SN extends DbSelfOrDescendantSn<CN> = DbSelfOrDescendantSn<CN>,
  VN extends VarbNameNext<SN> = VarbNameNext<SN>
> extends OneDbSectionVarbInfo<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}
