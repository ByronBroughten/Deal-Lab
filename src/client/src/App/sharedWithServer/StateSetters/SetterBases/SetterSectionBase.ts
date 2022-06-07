import { SectionName } from "../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { SetterSectionsBase, SetterSectionsProps } from "./SetterSectionsBase";

export interface SetterSectionProps<SN extends SectionName>
  extends SetterSectionsProps,
    GetterSectionProps<SN> {}

export class SetterSectionBase<
  SN extends SectionName
> extends SetterSectionsBase {
  readonly getterSectionBase: GetterSectionBase<SN>;

  constructor(props: SetterSectionProps<SN>) {
    super(props);
    this.getterSectionBase = new GetterSectionBase(props);
  }
  get setterSectionProps(): SetterSectionProps<SN> {
    return {
      ...this.setterSectionsProps,
      ...this.getterSectionBase.getterSectionProps,
    };
  }
}
