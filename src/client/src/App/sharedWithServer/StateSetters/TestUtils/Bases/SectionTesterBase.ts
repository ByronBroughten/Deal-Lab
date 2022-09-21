import { SetStateAction } from "react";
import { FeSectionInfo } from "../../../SectionsMeta/Info";
import { SectionNameByType } from "../../../SectionsMeta/SectionNameByType";
import { SetSections } from "../../../stateClassHooks/useSections";
import { StateSections } from "../../../StateSections/StateSections";
import { SetterSectionProps } from "../../SetterBases/SetterSectionBase";
import { SetterSections } from "../../SetterSections";

export interface SectionTesterProps<SN extends SectionNameByType> {
  sectionName: SN;
  feId: string;
  state: { sections: StateSections };
}

export class SectionTesterBase<SN extends SectionNameByType> {
  readonly state: { sections: StateSections };
  readonly sectionName: SN;
  readonly feId: string;
  readonly testSetSections: SetSections;
  constructor({ state, sectionName, feId }: SectionTesterProps<SN>) {
    this.state = state;
    this.sectionName = sectionName;
    this.feId = feId;
    this.testSetSections = this.makeTestSetSections();
  }
  private makeTestSetSections(): SetSections {
    return (value: SetStateAction<StateSections>): void => {
      if (value instanceof StateSections) {
        this.state.sections = value;
      } else if (typeof value === "function") {
        this.state.sections = value(this.state.sections);
      } else throw new Error(`value "${value}" is invalid.`);
    };
  }
  get feInfo(): FeSectionInfo<SN> {
    return {
      sectionName: this.sectionName,
      feId: this.feId,
    };
  }
  get sectionTesterProps(): SectionTesterProps<SN> {
    return {
      state: this.state,
      ...this.feInfo,
    };
  }
  get setterSectionTestProps(): SetterSectionProps<SN> {
    return {
      ...this.feInfo,
      ...SetterSections.initProps({
        sections: this.state.sections,
        setSections: this.testSetSections,
      }),
    };
  }
}
