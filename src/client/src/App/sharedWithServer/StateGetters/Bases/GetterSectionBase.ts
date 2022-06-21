import { Id } from "../../SectionsMeta/baseSections/id";
import { FeSectionInfo } from "../../SectionsMeta/Info";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import { StateSections } from "../../StateSections/StateSections";
import { GetterListBase, GetterListProps } from "./GetterListBase";

export interface GetterSectionProps<SN extends SectionName>
  extends GetterListProps<SN> {
  feId: string;
}
export class GetterSectionBase<
  SN extends SectionName
> extends GetterListBase<SN> {
  readonly feId: string;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.feId = props.feId;
    const { sections } = props.sectionsShare;
    if (!sections.hasSection(this.feSectionInfo)) {
      throw new Error(
        `No section with sectionName ${this.sectionName} and feId ${this.feId}`
      );
    }
  }
  get feSectionInfo(): FeSectionInfo<SN> {
    return {
      sectionName: this.sectionName,
      feId: this.feId,
    };
  }
  get getterSectionProps(): GetterSectionProps<SN> {
    return {
      ...this.feSectionInfo,
      sectionsShare: this.sectionsShare,
    };
  }
  static isGetterBaseProps(
    value: any
  ): value is GetterSectionProps<SectionName> {
    return (
      typeof value === "object" &&
      Id.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      (value as GetterSectionProps<SectionName>).sectionsShare
        .sections instanceof StateSections
    );
  }
}
