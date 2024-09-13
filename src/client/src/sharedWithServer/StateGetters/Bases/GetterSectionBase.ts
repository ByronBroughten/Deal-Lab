import { StateSections } from "../../State/StateSections";
import {
  SectionNameByType,
  sectionNameS,
} from "../../stateSchemas/schema6SectionChildren/SectionNameByType";
import { IdS } from "../../utils/IdS";
import { FeSectionInfo } from "../Identifiers/FeInfo";
import { GetterListBase, GetterListProps } from "./GetterListBase";

export interface GetterSectionProps<SN extends SectionNameByType>
  extends GetterListProps<SN> {
  feId: string;
}
export class GetterSectionBase<
  SN extends SectionNameByType
> extends GetterListBase<SN> {
  readonly feId: string;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.feId = props.feId;
    const { sections } = props.sectionsShare;
    if (!sections.hasSection(this.feInfo)) {
      throw new Error(
        `No section with sectionName ${this.sectionName} and feId ${this.feId}`
      );
    }
  }
  get feInfo(): FeSectionInfo<SN> {
    return {
      sectionName: this.sectionName,
      feId: this.feId,
    };
  }
  get feSectionInfo(): FeSectionInfo<SN> {
    return this.feInfo;
  }
  get getterSectionProps(): GetterSectionProps<SN> {
    return {
      ...this.feInfo,
      ...this.getterSectionsProps,
    };
  }
  static isGetterBaseProps(
    value: any
  ): value is GetterSectionProps<SectionNameByType> {
    return (
      typeof value === "object" &&
      IdS.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      (value as GetterSectionProps<SectionNameByType>).sectionsShare
        .sections instanceof StateSections
    );
  }
}
