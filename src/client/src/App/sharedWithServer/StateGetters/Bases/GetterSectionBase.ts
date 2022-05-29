import { pick } from "lodash";
import { Id } from "../../SectionsMeta/baseSections/id";
import { FeSectionInfo } from "../../SectionsMeta/Info";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import { StateSections } from "../../StateSections/StateSectionsNext";
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
    if (!GetterSectionBase.isGetterBaseProps(props)) {
      throw new Error("`props` is not GetterSectionProps.");
    }
    this.feId = props.feId;
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
  static initPropsWithMain(): GetterSectionProps<"main"> {
    const sections = StateSections.initWithMain();
    const main = sections.rawSectionList("main")[0];
    if (main)
      return {
        ...pick(main, ["sectionName", "feId"]),
        sectionsShare: { sections },
      };
    else throw new Error("A main section should have been initialized.");
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
