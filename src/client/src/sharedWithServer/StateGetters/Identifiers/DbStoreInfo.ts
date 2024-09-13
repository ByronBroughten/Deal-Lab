import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import {
  DbSectionName,
  DbStoreName,
} from "../../stateSchemas/fromSchema6SectionChildren/DbStoreName";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { VarbValue } from "../../stateSchemas/schema4ValueTraits/StateValue";

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
