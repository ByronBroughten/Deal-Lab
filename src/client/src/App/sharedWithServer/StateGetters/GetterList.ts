import { SectionNotFoundError } from "../../utils/error";
import { HasSectionNameProp } from "../HasInfoProps/HasSectionNameProp";
import {
  HasSharedSections,
  SharedSections,
} from "../HasInfoProps/HasSharedSectionsProp";
import { SpecificIdInfo } from "../SectionsMeta/baseSections/id";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSections } from "../SectionsState/SectionsState";
import { Arr } from "../utils/Arr";
import { GetterSection } from "./GetterSection";

export interface GetterListProps<SN extends SectionName>
  extends HasSharedSections {
  sectionName: SN;
}

export class GetterListBase<
  SN extends SectionName
> extends HasSectionNameProp<SN> {
  readonly shared: SharedSections;
  constructor(props: GetterListProps<SN>) {
    super(props.sectionName);
    this.shared = props.shared;
  }
}

export class GetterList<SN extends SectionName> extends GetterListBase<SN> {
  get stateSections(): FeSections {
    return this.shared.sections;
  }
  get stateList() {
    return this.stateSections.list(this.sectionName).core.list;
  }
  get last(): GetterSection<SN> {
    const stateSection = Arr.lastOrThrow(this.stateList);
    return new GetterSection({
      ...stateSection.info,
      shared: this.shared,
    });
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
      shared: this.shared,
    });
  }
  getByFeId(feId: string): GetterSection<SN> {
    const section = this.stateList.find((section) => section.feId === feId);
    if (!section) throw this.sectionNotFoundError(feId);
    return this.getterSection(feId);
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
    }
  }
}
