import { SetSections } from "../../../modules/useSections";
import { SectionName } from "../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";

export interface SetterSectionProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  setSections: SetSections;
}

export class SetterSectionBase<SN extends SectionName> {
  readonly getterSectionBase: GetterSectionBase<SN>;
  readonly setSections: () => void;
  constructor({ setSections, ...rest }: SetterSectionProps<SN>) {
    this.setSections = () =>
      setSections(() => this.getterSectionBase.sectionsShare.sections);
    this.getterSectionBase = new GetterSectionBase(rest);
  }
}
