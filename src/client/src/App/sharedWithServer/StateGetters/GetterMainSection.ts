import { FeVarbInfo } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "./GetterSection";

export type FeCellValueInfo =
  | InEntityVarbInfo
  | FeVarbInfo<SectionName<"hasRowIndex">>;

export class GetterMainSection<
  SN extends SectionName<"hasRowIndex"> = SectionName<"hasRowIndex">
> extends GetterSection<SN> {
  get indexName(): SectionName<"rowIndexNext"> {
    return this.meta.rowIndexName;
  }
  inEntityInfoToFeInfo(varbInfo: InEntityVarbInfo): FeCellValueInfo {
    // so. if the varbInfo has an indexName
    // it should instead use the present source
    // as the index won't exist.
    // but on the serverside it will use the index.
    if (varbInfo.sectionName === this.indexName) {
      return {
        ...this.feInfoMixed,
        varbName: varbInfo.varbName,
      };
    } else return varbInfo;
  }
}
