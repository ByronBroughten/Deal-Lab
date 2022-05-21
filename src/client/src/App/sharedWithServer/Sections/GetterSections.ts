import { SectionSelfGetters } from "../SectionFocal/SectionSelfGetters";
import { sectionMetas } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { FeSectionInfo, InfoS, VarbInfo } from "../SectionsMeta/Info";
import {
  MultiFindByFocalInfo,
  MultiFindByFocalVarbInfo,
  MultiSectionInfo,
  MultiVarbInfo,
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
    const focalSection = this.sectionByMixed(focalInfo);
    switch (info.id) {
      case "local": {
        if (focalSection.sectionName === info.sectionName) {
          return focalSection as any as FeSectionI<SN>;
        } else
          throw new Error("Local section did not match the focal section.");
      }
      case "parent": {
        const { parentInfoSafe } = focalSection;
        if (parentInfoSafe.sectionName !== info.sectionName)
          throw new Error(
            "Parent section does not match the focal section's parent."
          );
        return this.section(parentInfoSafe) as any as FeSectionI<SN>;
      }
      default:
        throw new Error("Exhausted MultiFindByFocalInfo options.");
    }
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
  ): SectionSelfGetters<SN> {
    return new SectionSelfGetters({
      shared: this.shared,
      ...info,
    });
  }
}
