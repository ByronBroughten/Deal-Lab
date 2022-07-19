import { sectionsMeta, SectionsMeta } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { DbSectionInfo } from "../SectionsMeta/baseSectionsUtils/DbSectionInfo";
import {
  SectionInfoMixed,
  VarbInfoMixed,
} from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export class GetterSections extends GetterSectionsBase {
  get meta(): SectionsMeta {
    return sectionsMeta;
  }
  list<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      sectionsShare: this.sectionsShare,
    });
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): GetterSection<SN> {
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
  newestEntry<SN extends SectionName>(sectionName: SN): GetterSection<SN> {
    return this.list(sectionName).last;
  }
  get one() {
    return this.section;
  }
  section<SN extends SectionName>(info: FeSectionInfo<SN>): GetterSection<SN> {
    return new GetterSection({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  sectionVarbs<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return new GetterVarbs({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  varbs<SN extends SimpleSectionName>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return this.section(info).varbs;
  }
  varb<SN extends SectionName>({
    varbName,
    ...info
  }: FeVarbInfo<SN>): GetterVarb<SN> {
    return this.varbs(info).one(varbName);
  }
  sectionsByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...idInfo
  }: SectionInfoMixed<SN>): GetterSection<SN>[] {
    return this.list(sectionName).getMultiByMixed(idInfo);
  }
  sectionByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...info
  }: SectionInfoMixed<SN>): GetterSection<SN> {
    return this.list(sectionName).getOneByMixed(info);
  }
  sectionByDbInfo<SN extends SimpleSectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): GetterSection<SN> {
    return this.list(sectionName).getByDbId(dbId);
  }
  varbByMixed<SN extends SectionName>({
    varbName,
    ...info
  }: VarbInfoMixed<SN>): GetterVarb<SN> {
    return this.sectionByMixed(info).varb(varbName);
  }
  numObjOrNotFoundByMixedAssertOne<SN extends SectionName>(
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
