import { SectionNotFoundError } from "../../utils/error";
import { SpecificIdInfo } from "../SectionsMeta/baseSections/id";
import { SectionName } from "../SectionsMeta/SectionName";
import { RawFeSection } from "../StateSections/StateSectionsNext";
import { Arr } from "../utils/Arr";
import { GetterListBase } from "./Bases/GetterListBase";
import { GetterSection } from "./GetterSection";

export class GetterList<SN extends SectionName> extends GetterListBase<SN> {
  private get stateList(): RawFeSection<SN>[] {
    return this.sectionsShare.sections.rawSectionList(this.sectionName);
  }
  get oneAndOnly(): GetterSection<SN> {
    if (this.stateList.length !== 1)
      throw new Error(
        `There is not exactly one section with sectionName ${this.sectionName}.`
      );
    return this.last;
  }
  get last(): GetterSection<SN> {
    const stateSection = Arr.lastOrThrow(this.stateList);
    return this.getterSection(stateSection.feId);
  }
  get arr(): GetterSection<SN>[] {
    return this.stateList.map(({ feId }) => this.getterSection(feId));
  }
  idx(feId: string): number {
    const idx = this.stateList.findIndex((section) => section.feId === feId);
    if (idx < 0) throw this.sectionNotFoundError(feId);
    return idx;
  }
  sectionNotFoundError(id: string): SectionNotFoundError {
    return new SectionNotFoundError(
      `No section with sectionName ${this.sectionName} and id ${id}`
    );
  }
  private getterSection(feId: string): GetterSection<SN> {
    return new GetterSection({
      sectionName: this.sectionName,
      feId,
      sectionsShare: this.sectionsShare,
    });
  }
  getByFeId(feId: string): GetterSection<SN> {
    const section = this.stateList.find((section) => section.feId === feId);
    if (!section) throw this.sectionNotFoundError(feId);
    return this.getterSection(feId);
  }
  hasByFeId(feId: string): boolean {
    try {
      this.getByFeId(feId);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }
  getByFeIds(feIds: string[]): GetterSection<SN>[] {
    const rawSections = this.stateList.filter(({ feId }) =>
      feIds.includes(feId)
    );
    return rawSections.map(({ feId }) => this.getterSection(feId));
  }
  getByDbId(dbId: string): GetterSection<SN> {
    const section = this.stateList.find((section) => section.dbId === dbId);
    if (!section) throw this.sectionNotFoundError(dbId);
    return this.getterSection(section.feId);
  }
  getSpecific({ id, idType }: SpecificIdInfo): GetterSection<SN> {
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
        return this.last;
      }
      default: {
        throw new Error(`invalid idType: ${idType}`);
      }
    }
  }
  hasByMixed(idInfo: SpecificIdInfo): boolean {
    try {
      this.getSpecific(idInfo);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }
}
