import { DbSectionInfo } from "../SectionPack/DbSectionInfo";
import { sectionMetas, SectionsMeta } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import {
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export class GetterSections extends GetterSectionsBase {
  get meta(): SectionsMeta {
    return sectionMetas;
  }
  list<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      sectionsShare: this.sectionsShare,
    });
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
  }: VarbInfo<SN>): GetterVarb<SN> {
    return this.varbs(info).one(varbName);
  }
  sectionByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...idInfo
  }: SpecificSectionInfo<SN>): GetterSection<SN> {
    return this.list(sectionName).getSpecific(idInfo);
  }
  sectionByDbInfo<SN extends SimpleSectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): GetterSection<SN> {
    return this.list(sectionName).getByDbId(dbId);
  }
  varbsByMixed<SN extends SectionName>(
    mixedSectionInfo: SpecificSectionInfo<SN>
  ): GetterVarbs<SN> {
    return this.sectionByMixed(mixedSectionInfo).varbs;
  }
  varbByMixed<SN extends SectionName>({
    varbName,
    ...info
  }: SpecificVarbInfo<SN>): GetterVarb<SN> {
    return this.varbsByMixed(info).one(varbName);
  }
  numObjOrNotFoundByMixed<SN extends SectionName>(info: SpecificVarbInfo<SN>) {
    if (this.hasSectionMixed(info)) {
      return this.varbByMixed(info).value("numObj");
    } else return "Not Found";
  }
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionByDbInfo({ sectionName, dbId }: DbSectionInfo): boolean {
    return this.hasSectionMixed({
      sectionName,
      id: dbId,
      idType: "dbId",
    } as SpecificSectionInfo);
  }
  hasSectionMixed({ sectionName, ...idInfo }: SpecificSectionInfo): boolean {
    return this.list(sectionName).hasByMixed(idInfo);
  }
}
