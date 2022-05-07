import {
  AddSectionProps,
  AddSectionPropsNext,
} from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { FeInfo, InfoS } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { StrictOmit } from "../../utils/types";
import FeSection, { NewChildInfo } from "../FeSection";
import { FullSection, HasSharableSections } from "./Sections";

export class DescendentAdder<SN extends SectionName> extends FullSection<SN> {
  addChild({ idx, ...props }: AddSectionPropsNext<ChildName<SN>>) {
    this.pushSectionToList(props);
    this.addNewChildFeId(props);
  }
  private pushSectionToList(props: AddSectionPropsNext) {
    const { sectionName } = props;
    this.sections = this.sections.updateList(
      this.sections.list(sectionName).push(
        FeSection.initNext({
          ...props,
        })
      )
    );
  }
  private addNewChildFeId(childInfo: StrictOmit<NewChildInfo<SN>, "feId">) {
    const newFeId = this.sections.list(childInfo.sectionName).last.feId;
    const nextSelf = this.selfSection.addChildFeIdNext({
      ...childInfo,
      feId: newFeId,
    });
    this.sections = this.sections.updateSection(nextSelf as any);
  }
}

export class SectionAdder extends HasSharableSections {
  addSections(parentFirstPropsArr: AddSectionProps[]) {
    for (const props of parentFirstPropsArr as AddSectionProps[]) {
      this.addSection(props);
    }
  }
  addSection({ idx, ...props }: AddSectionProps) {
    this.pushSectionToList(props);
    const { feInfo } = this.sections.list(props.sectionName).last;
    if (InfoS.is.fe(feInfo, "hasParent")) {
      this.addToParentChildIds(feInfo, idx);
    }
  }
  private pushSectionToList(props: AddSectionProps) {
    const { sectionName, parentFinder } = props;
    this.sections = this.sections.updateList(
      this.sections.list(sectionName).push(
        FeSection.initNext({
          parentInfo: this.sections.parentFinderToInfo(parentFinder as any),
          ...props,
        })
      )
    );
  }
  private addToParentChildIds(feInfo: FeInfo<"hasParent">, idx?: number) {
    const parentSection = this.sections.parent(feInfo);
    const nextParent = parentSection.addChildFeId(feInfo, idx);
    this.sections = this.sections.updateSection(nextParent);
  }
  static initCore() {}
}
