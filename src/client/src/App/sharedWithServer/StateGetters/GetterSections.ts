import { sectionsMeta, SectionsMeta } from "../SectionsMeta";
import { DbSectionInfo } from "../SectionsMeta/baseSectionsVarbs/DbSectionInfo";
import {
  SectionInfoMixed,
  VarbInfoMixed,
} from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionsBase } from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export class GetterSections extends GetterSectionsBase {
  get meta(): SectionsMeta {
    return sectionsMeta;
  }
  list<SN extends SectionNameByType>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      sectionsShare: this.sectionsShare,
    });
  }
  oneAndOnly<SN extends SectionNameByType>(sectionName: SN): GetterSection<SN> {
    return this.list(sectionName).oneAndOnly;
  }
  get main(): GetterSection<"main"> {
    return this.list("main").oneAndOnly;
  }
  get mainFeInfo() {
    return this.main.feInfo;
  }
  get mainFeInfoMixed() {
    return this.main.feInfoMixed;
  }
  newestEntry<SN extends SectionNameByType>(
    sectionName: SN
  ): GetterSection<SN> {
    return this.list(sectionName).last;
  }
  get one() {
    return this.section;
  }
  section<SN extends SectionNameByType>(
    info: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  sectionVarbs<SN extends SectionNameByType>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return new GetterVarbs({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  varbs<SN extends SectionName>(info: FeSectionInfo<SN>): GetterVarbs<SN> {
    return this.section(info).varbs;
  }
  varb<SN extends SectionNameByType>({
    varbName,
    ...info
  }: FeVarbInfo<SN>): GetterVarb<SN> {
    return this.varbs(info).one(varbName);
  }
  sectionsByMixed<SN extends SectionName>({
    sectionName,
    ...idInfo
  }: SectionInfoMixed<SN>): GetterSection<SN>[] {
    return this.list(sectionName).getMultiByMixed(idInfo);
  }
  sectionByMixed<SN extends SectionName>({
    sectionName,
    ...info
  }: SectionInfoMixed<SN>): GetterSection<SN> {
    return this.list(sectionName).getOneByMixed(info);
  }
  sectionByDbInfo<SN extends SectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): GetterSection<SN> {
    return this.list(sectionName).getByDbId(dbId);
  }
  varbByMixed<SN extends SectionNameByType>({
    varbName,
    ...info
  }: VarbInfoMixed<SN>): GetterVarb<SN> {
    return this.sectionByMixed(info).varb(varbName);
  }
  numObjOrNotFoundByMixedAssertOne<SN extends SectionNameByType>(
    info: VarbInfoMixed<SN>
  ): string {
    if (this.hasSectionMixed(info)) {
      return this.varbByMixed(info).displayVarb();
    } else return "Not Found";
  }
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionByDbInfo({ sectionName, dbId }: DbSectionInfo): boolean {
    return this.list(sectionName).hasByDbId(dbId);
  }
  hasSectionMixed({ sectionName, ...idInfo }: SectionInfoMixed): boolean {
    return this.list(sectionName).hasByMixed(idInfo);
  }
}
