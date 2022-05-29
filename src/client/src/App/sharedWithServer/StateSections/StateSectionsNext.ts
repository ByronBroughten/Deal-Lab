import { OutEntity } from "../FeSections/FeSection/FeVarb/entities";
import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { Id } from "../SectionsMeta/baseSections/id";
import {
  FeParentInfo,
  FeSectionInfo,
  noParentInfoNext,
  VarbInfo,
} from "../SectionsMeta/Info";
import { ChildIdArrsNarrow } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { initRawSection, initRawVarbs } from "./initRawSection";

export type RawFeVarb<SN extends SectionName> = {
  value: StateValue;
  outEntities: OutEntity[];
  manualUpdateEditorToggle: boolean | undefined;
  // used to ensure rerenders upon loading varbs
};
export type RawFeVarbs<SN extends SectionName> = {
  [key: string]: RawFeVarb<SN>;
};
export type RawFeSection<SN extends SectionName> = {
  readonly sectionName: SN;
  readonly feId: string;
  readonly parentInfo: FeParentInfo<SN>;
  readonly childFeIds: ChildIdArrsNarrow<SN>;
  readonly dbId: string;
  readonly varbs: RawFeVarbs<SN>;
};

export type RawFeSections = {
  readonly [SN in SectionName]: readonly RawFeSection<SN>[];
};

export type RawSectionListProps<SN extends SectionName> = {
  sectionName: SN;
  list: RawFeSection<SN>[];
};
type UpdateVarbProps<SN extends SectionName> = {
  feVarbInfo: VarbInfo<SN>;
  rawVarb: RawFeVarb<SN>;
};

export class StateSections {
  constructor(private core: RawFeSections) {}
  get rawSections(): RawFeSections {
    return this.core;
  }
  rawSectionList<SN extends SectionName>(sectionName: SN): RawFeSection<SN>[] {
    return this.core[sectionName] as RawFeSection<SN>[];
  }
  sectionIdx<SN extends SectionName>({
    sectionName,
    feId,
  }: FeSectionInfo<SN>): number {
    return Arr.idxOrThrow(
      this.rawSectionList(sectionName),
      (section) => section.feId === feId
    );
  }
  // property feId received: "ZS5eR_IZ5j11"
  // feId for the one property: "h7HylG67O_5p"
  rawSection<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): RawFeSection<SN> {
    const idx = this.sectionIdx(feInfo);
    return this.rawSectionList(feInfo.sectionName)[idx];
  }
  rawVarb<SN extends SectionName>({
    varbName,
    ...rest
  }: VarbInfo<SN>): RawFeVarb<SN> {
    return this.rawSection(rest).varbs[varbName];
  }
  updateSectionLists(lists: Partial<RawFeSections>): StateSections {
    return new StateSections({
      ...this.core,
      ...lists,
    });
  }
  updateSectionList<SN extends SectionName>({
    sectionName,
    list,
  }: RawSectionListProps<SN>): StateSections {
    return this.updateSectionLists({
      [sectionName]: list,
    });
  }
  updateSection<SN extends SectionName>(
    rawSection: RawFeSection<SN>
  ): StateSections {
    const { sectionName } = rawSection;
    const nextList = [...this.rawSectionList(sectionName)];
    const idx = this.sectionIdx(rawSection);
    nextList[idx] = rawSection;
    return this.updateSectionList({
      sectionName,
      list: nextList,
    });
  }
  updateVarb<SN extends SectionName>({
    feVarbInfo: { varbName, ...feSectionInfo },
    rawVarb,
  }: UpdateVarbProps<SN>): StateSections {
    const section = this.rawSection(feSectionInfo);
    const nextVarbs = { ...section.varbs };
    return this.updateSection({
      ...section,
      varbs: Obj.updateIfPropExists({
        obj: nextVarbs,
        key: varbName,
        val: rawVarb,
      }),
    });
  }
  static initRawSection = initRawSection;
  static initRawVarbs = initRawVarbs;
  static initWithMain(): StateSections {
    const mainSection = StateSections.initRawSection({
      sectionName: "main",
      feId: Id.make(),
      parentInfo: noParentInfoNext,
    });
    const sections = this.initEmpty();
    return sections.updateSectionList({
      sectionName: "main",
      list: [mainSection],
    });
  }

  static initEmpty(): StateSections {
    return new StateSections(this.emptyRawSections());
  }
  static emptyRawSections(): RawFeSections {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = [];
      return core;
    }, {} as { -readonly [SN in keyof RawFeSections]: RawFeSections[SN] });
  }
}
