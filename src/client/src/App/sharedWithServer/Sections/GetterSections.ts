import { SelfGetters } from "../SectionFocal/SelfGetters";
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
import { FeSections } from "../SectionsState/SectionsState";
import { HasSharedSections } from "./HasSharedSections";

export class GetterSections extends HasSharedSections {
  protected get sections(): FeSections {
    return this.shared.sections;
  }
  get meta() {
    return sectionMetas;
  }
  list<SN extends SimpleSectionName>(sectionName: SN): SectionList<SN> {
    const list = this.sections.core[sectionName] as SectionList;
    return list as any;
  }
  get mainFeInfo() {
    return this.list("main").first.feInfo;
  }
  section<SN extends SimpleSectionName>({
    sectionName,
    feId,
  }: FeSectionInfo<SN>): FeSectionI<SN> {
    return this.list(sectionName).getByFeId(feId);
  }
  sectionByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...idInfo
  }: SpecificSectionInfo<SN>): FeSectionI<SN> {
    return this.list(sectionName).getSpecific(idInfo);
  }
  get one() {
    return this.section;
  }
  varbs<SN extends SimpleSectionName>(info: FeSectionInfo<SN>): FeVarbsI<SN> {
    return this.section(info).varbs;
  }
  varb({ varbName, ...info }: VarbInfo): FeVarb {
    return this.varbs(info).one(varbName);
  }
  varbByMixed({ varbName, ...info }: SpecificVarbInfo): FeVarb {
    return this.sectionByMixed(info).varbs.one(varbName);
  }
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionMixed({ sectionName, ...idInfo }: SpecificSectionInfo) {
    return this.list(sectionName).has(idInfo);
  }
  makeFocalGetter<SN extends SectionName>(
    info: FeSectionInfo<SN>
  ): SelfGetters<SN> {
    return new SelfGetters({
      shared: this.shared,
      ...info,
    });
  }
}
