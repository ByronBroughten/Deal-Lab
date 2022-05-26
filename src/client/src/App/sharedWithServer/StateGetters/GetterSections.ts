import { HasSharedSectionsProp } from "../HasInfoProps/HasSharedSectionsProp";
import { sectionMetas } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import {
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { FeVarbsI } from "../SectionsState/FeSection/FeVarbs";
import { SectionList } from "../SectionsState/SectionList";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

// GetterSections
// GetterList
// GetterSection
// GetterVarb

export class GetterSections extends HasSharedSectionsProp {
  get stateSections() {
    return this.shared.sections;
  }
  get meta() {
    return sectionMetas;
  }
  list<SN extends SimpleSectionName>(sectionName: SN): SectionList<SN> {
    const list = this.sections.core[sectionName] as SectionList;
    return list as any;
  }
  listNext<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      shared: this.shared,
    });
  }

  get mainFeInfo() {
    return this.list("main").first.feInfo;
  }
  get mainInfo() {
    return this.list("main").first.info;
  }
  section<SN extends SimpleSectionName>({
    sectionName,
    feId,
  }: FeSectionInfo<SN>): FeSectionI<SN> {
    return this.list(sectionName).getByFeId(feId);
  }
  newestEntry<SN extends SectionName>(sectionName: SN): GetterSection<SN> {
    return this.listNext(sectionName).last;
  }
  get one() {
    return this.section;
  }
  sectionNext<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({
      ...info,
      shared: this.shared,
    });
  }
  sectionVarbs<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return new GetterVarbs({
      ...info,
      shared: this.shared,
    });
  }
  varbs<SN extends SimpleSectionName>(info: FeSectionInfo<SN>): FeVarbsI<SN> {
    return this.section(info).varbs;
  }
  varbsNext<SN extends SimpleSectionName>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return this.sectionNext(info).varbs;
  }
  varb({ varbName, ...info }: VarbInfo): FeVarb {
    return this.varbs(info).one(varbName);
  }
  varbNext<SN extends SectionName>({
    varbName,
    ...info
  }: VarbInfo<SN>): GetterVarb<SN> {
    return this.varbsNext(info).one(varbName);
  }
  sectionByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...idInfo
  }: SpecificSectionInfo<SN>): GetterSection<SN> {
    return this.listNext(sectionName).getSpecific(idInfo);
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
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionMixed({ sectionName, ...idInfo }: SpecificSectionInfo) {
    return this.list(sectionName).has(idInfo);
  }
  makeFocalGetter<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({
      shared: this.shared,
      ...info,
    });
  }
}
