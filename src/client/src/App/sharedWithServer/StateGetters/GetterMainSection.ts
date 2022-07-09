import { FeVarbInfoMixed } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "./GetterSection";

export type FeCellValueInfo =
  | InEntityVarbInfo
  | FeVarbInfoMixed<SectionName<"hasRowIndex">>;

export class GetterMainSection<
  SN extends SectionName<"hasRowIndex"> = SectionName<"hasRowIndex">
> extends GetterSection<SN> {
  get indexName(): SectionName<"rowIndexNext"> {
    return this.meta.rowIndexName;
  }
  inEntityInfoToFeInfo(varbInfo: InEntityVarbInfo): FeCellValueInfo {
    if (varbInfo.sectionName === this.indexName) {
      return {
        ...this.feInfoMixed,
        varbName: varbInfo.varbName,
      } as FeVarbInfoMixed<SectionName<"hasRowIndex">>;
    } else return varbInfo;
  }
}
