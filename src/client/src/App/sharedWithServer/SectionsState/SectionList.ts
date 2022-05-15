import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { SpecificIdInfo } from "../SectionsMeta/baseSections/id";
import { FeNameInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { Arr } from "../utils/Arr";
import { FeSectionI } from "./FeSection";
import { FeSectionCore } from "./FeSection/FeSectionCore";

class SectionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SectionList<SN extends SimpleSectionName = SimpleSectionName> {
  constructor(
    readonly core: { sectionName: SN; list: readonly FeSectionI<SN>[] }
  ) {}
  get meta(): SectionMeta<"fe", SN> {
    return sectionMetas.section(this.sectionName);
  }
  protected get list() {
    return this.core.list;
  }
  get hasAtLeastOne(): boolean {
    return this.list.length > 0 ? true : false;
  }
  get isEmpty(): boolean {
    return this.list.length === 0;
  }
  get sectionName() {
    return this.core.sectionName;
  }
  get first(): FeSectionI<SN> {
    const first = this.list[0];
    if (!first)
      throw new SectionNotFoundError(
        "Tried to get first section of sectionList, but there are none."
      );
    return first;
  }
  get last(): FeSectionI<SN> {
    return Arr.lastOrThrow(this.list);
  }
  get feIds(): string[] {
    return this.list.map(({ feId }) => feId);
  }
  get feInfos(): FeNameInfo<SN>[] {
    return this.list.map(({ feInfo }) => feInfo);
  }
  push(section: FeSectionI<SN>): SectionList<SN> {
    return this.updateList([...this.list, section]);
  }
  insert(section: FeSectionI<SN>, idx: number): SectionList<SN> {
    return this.updateList(Arr.insert(this.list, section, idx));
  }
  replace(section: FeSectionI<SN>): SectionList<SN> {
    const idx = this.feIdToValidIdx(section.feId);
    return this.updateList(Arr.replaceAtIdxClone(this.list, section, idx));
  }
  removeByFeId(feId: string): SectionList<SN> {
    const idx = this.list.findIndex((section) => section.feId === feId);
    return this.updateList(Arr.removeAtIndex(this.list, idx));
  }
  getByFeId(id: string): FeSectionI<SN> {
    const section = this.list.find((section) => section.feId === id);
    if (!section) {
      throw new SectionNotFoundError(
        `No section with sectionName ${this.sectionName} and feId ${id}`
      );
    }

    return section;
  }
  getByDbId(id: string): FeSectionI<SN> {
    const section = this.list.find((section) => section.dbId === id);
    if (!section)
      throw new SectionNotFoundError(
        `No section with sectionName ${this.sectionName} and feId ${id}`
      );
    return section;
  }
  getSpecific({ id, idType }: SpecificIdInfo): FeSectionI<SN> {
    switch (idType) {
      case "feId":
        return this.getByFeId(id);
      case "dbId":
        return this.getByDbId(id);
      case "relative": {
        if (id !== "static")
          throw new Error(
            "If idType is relative, findSpecific expects id to be static."
          );
        return this.first;
      }
    }
  }
  feIdToValidIdx(feId: string): number {
    const idx = this.list.findIndex((section) => section.feId === feId);
    if (idx < 0) throw new Error("Index not found.");
    else return idx;
  }
  hasByFeId(feId: string) {
    try {
      this.getByFeId(feId);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }
  has(idInfo: SpecificIdInfo): boolean {
    try {
      this.getSpecific(idInfo);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }

  private updateList(list: FeSectionI<SN>[]): SectionList<SN> {
    return new SectionList({ ...this.core, list });
  }
}

export type FeSectionListRaw<SN extends SimpleSectionName> =
  FeSectionCore<SN>[];
