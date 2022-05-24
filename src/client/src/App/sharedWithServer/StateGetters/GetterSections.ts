import { HasSharedSectionsProp } from "../HasInfoProps/HasSharedSectionsProp";
import { sectionMetas } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { FeSectionInfo, InfoS, VarbInfo } from "../SectionsMeta/Info";
import {
  MultiFindByFocalInfo,
  MultiFindByFocalVarbInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  RelSectionInfo,
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
  newestEntry<SN extends SectionName>(sectionName: SN) {
    return this.list(sectionName).last;
  }
  sectionByMixed<SN extends SimpleSectionName>({
    sectionName,
    ...idInfo
  }: SpecificSectionInfo<SN>): FeSectionI<SN> {
    return this.list(sectionName).getSpecific(idInfo);
  }
  displayNameByMixed(feVarbInfo: SpecificVarbInfo): string {
    const { displayName } = this.varbByMixed(feVarbInfo);
    if (typeof displayName === "string") return displayName;
    const displayNameVarb = this.varbByFocal(feVarbInfo, displayName);
    return displayNameVarb.value("string");
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
  varbs<SN extends SimpleSectionName>(info: FeSectionInfo<SN>): FeVarbsI<SN> {
    return this.section(info).varbs;
  }
  varb({ varbName, ...info }: VarbInfo): FeVarb {
    return this.varbs(info).one(varbName);
  }
  varbByMixed({ varbName, ...info }: SpecificVarbInfo): FeVarb {
    return this.sectionByMixed(info).varbs.one(varbName);
  }
  varbByFocal(
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiFindByFocalVarbInfo
  ): FeVarb {
    const section = this.sectionByFocal(focalInfo, feInfo);
    return section.varb(varbName);
  }
  varbsByFocal(
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiVarbInfo
  ): FeVarb[] {
    const sections = this.sectionsByFocal(focalInfo, feInfo);
    return sections.map((section) => section.varb(varbName));
  }
  sectionByFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiFindByFocalInfo<SN>
  ): FeSectionI<SN> {
    if (InfoS.is.specific(info)) return this.sectionByMixed(info);
    const section = this.sectionNext(this.sectionByMixed(focalInfo).info);
    return section.sectionByRelative(info as RelSectionInfo<SN>).stateSection;
  }
  sectionsByFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiSectionInfo<SN>
  ): FeSectionI<SN>[] {
    if (InfoS.is.specific(info)) {
      const section = this.sectionByMixed(info);
      return [section];
    } else if (InfoS.is.singleMulti(info)) {
      const section = this.sectionByFocal(focalInfo, info);
      return [section];
    } else {
      return this.sectionsByPluralFocal(focalInfo, info as any);
    }
  }
  sectionsByPluralFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiFindByFocalInfo<SN>
  ): FeSectionI<SN>[] {
    switch (info.id) {
      case "all": {
        return this.list(info.sectionName).core.list as FeSectionI<SN>[];
      }
      case "children": {
        const section = this.sectionByMixed(focalInfo);
        const { sectionName } = info;
        if (section.meta.isChildName(sectionName)) {
          const childFeIds = section.childFeIds(sectionName);
          return childFeIds.map((feId) =>
            this.section({ sectionName, feId })
          ) as FeSectionI<SN>[];
        } else
          throw new Error(
            "Child info does not match any of focal section's childNames."
          );
      }
      default:
        throw new Error("Exhausted MultiSectionInfo options.");
    }
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
