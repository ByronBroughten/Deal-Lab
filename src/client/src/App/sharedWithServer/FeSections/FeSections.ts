import { sectionMetas } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import {
  FeSectionInfo,
  InfoS,
  noParentInfoNext,
  VarbInfo,
} from "../SectionsMeta/Info";
import {
  MultiFindByFocalInfo,
  MultiFindByFocalVarbInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { FeSection, FeSectionI } from "./FeSection";
import FeVarb from "./FeSection/FeVarb";
import { FeVarbsI } from "./FeSection/FeVarbs";
import { SectionList } from "./SectionList";

export type SectionsStateCore = {
  readonly [SN in SimpleSectionName]: SectionList<SN>;
};

export class FeSections {
  constructor(readonly core: SectionsStateCore) {}
  get meta() {
    return sectionMetas;
  }
  list<SN extends SimpleSectionName>(sectionName: SN): SectionList<SN> {
    const list = this.core[sectionName] as SectionList;
    return list as any;
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
  varbs<SN extends SimpleSectionName>(info: FeSectionInfo<SN>): FeVarbsI<SN> {
    return this.section(info).varbs;
  }
  varb<SN extends SectionName<"hasVarb">>({
    varbName,
    ...info
  }: VarbInfo<SN>): FeVarb<SN> {
    return this.varbs(info).one(varbName);
  }
  varbByMixed<SN extends SectionName<"hasVarb">>({
    varbName,
    ...info
  }: SpecificVarbInfo<SN>): FeVarb<SN> {
    return this.sectionByMixed(info).varbs.one(varbName);
  }
  varbByFocal(
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiFindByFocalVarbInfo
  ): FeVarb {
    const section = this.sectionByFocal(focalInfo, feInfo);
    // when the multiInfo has "parent" as its relative id
    // if the relativeId is based on SectionMeta, there is
    // a chance the parent won't have the varbName
    return section.varb(varbName);
  }
  varbsByFocal<SN extends SectionName<"hasVarb">>(
    // this would be better on some kind of varb getter
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiVarbInfo<SN>
  ): FeVarb<SN>[] {
    const sections = this.sectionsByFocal(focalInfo, feInfo);
    return sections.map((section) => section.varb(varbName));
  }
  sectionByFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiFindByFocalInfo<SN>
  ): FeSectionI<SN> {
    // so, I'm already checking if the section is specific
    // and in that case returning it.
    // Am I dealing with specific?

    // wherever I use this, I would want to check that
    // the section is rel

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

  static init(): FeSections {
    return new FeSections(FeSections.initCore());
  }
  static initCore(): SectionsStateCore {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = new SectionList({
        sectionName,
        list: this.initList(sectionName),
      }) as any;
      return core;
    }, {} as { -readonly [SN in keyof SectionsStateCore]: SectionsStateCore[SN] });
  }
  static initList<SN extends SectionName>(sectionName: SN): FeSectionI<SN>[] {
    const listCore: FeSectionI<SN>[] = [];
    if (sectionName === "main") {
      listCore.push(
        FeSection.initNext({
          sectionName,
          parentInfo: noParentInfoNext as any,
        })
      );
    }
    return listCore;
  }
}
