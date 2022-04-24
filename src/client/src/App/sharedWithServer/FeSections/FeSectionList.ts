import { SimpleSectionName } from "../SectionMetas/baseSections";
import { SpecificIdInfo } from "../SectionMetas/baseSections/id";
import Arr from "../utils/Arr";
import FeSection, { FeSectionCore } from "./FeSection";

class SectionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class FeSectionList<SN extends SimpleSectionName> {
  constructor(
    readonly core: { sectionName: SN; list: readonly FeSection<SN>[] }
  ) {}
  get list() {
    return this.core.list;
  }
  get sectionName() {
    return this.core.sectionName;
  }
  get first(): FeSection<SN> {
    const first = this.list[0];
    if (!first)
      throw new SectionNotFoundError(
        "Tried to get first section of sectionList, but there are none."
      );
    return first;
  }
  get last(): FeSection<SN> {
    const last = Arr.lastVal(this.list);
    if (!last)
      throw new SectionNotFoundError(
        "Tried to get last section of sectionList, but there are none."
      );
    return last;
  }
  push(section: FeSection<SN>): FeSectionList<SN> {
    return this.updateList([...this.list, section]);
  }
  insert(section: FeSection<SN>, idx: number): FeSectionList<SN> {
    return this.updateList(Arr.insert(this.list, section, idx));
  }
  wipe(): FeSectionList<SN> {
    return this.updateList([]);
  }
  getByFeId(id: string): FeSection<SN> {
    const section = this.list.find((section) => section.feId === id);
    if (!section)
      throw new SectionNotFoundError(
        `No section with sectionName ${this.sectionName} and feId ${id}`
      );
    return section;
  }
  getByDbId(id: string): FeSection<SN> {
    const section = this.list.find((section) => section.dbId === id);
    if (!section)
      throw new SectionNotFoundError(
        `No section with sectionName ${this.sectionName} and feId ${id}`
      );
    return section;
  }
  getSpecific({ id, idType }: SpecificIdInfo): FeSection<SN> {
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
  has(idInfo: SpecificIdInfo): boolean {
    try {
      this.getSpecific(idInfo);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }

  private updateList(list: FeSection<SN>[]): FeSectionList<SN> {
    return new FeSectionList({ ...this.core, list });
  }
}

export type FeSectionListRaw<SN extends SimpleSectionName> =
  FeSectionCore<SN>[];
