import { SectionNameByType } from "../../../SectionsMeta/SectionNameByType";
import { SetterVarbProps } from "./../../SetterBases/SetterVarbBase";
import { SectionTesterBase, SectionTesterProps } from "./SectionTesterBase";

export interface SetterTesterVarbProps<SN extends SectionNameByType>
  extends SectionTesterProps<SN> {
  varbName: string;
}

export class SetterTesterVarbBase<
  SN extends SectionNameByType
> extends SectionTesterBase<SN> {
  readonly varbName: string;
  constructor({ varbName, ...rest }: SetterTesterVarbProps<SN>) {
    super(rest);
    this.varbName = varbName;
  }
  get varbInfo() {
    return {
      ...this.feInfo,
      varbName: this.varbName,
    };
  }
  get varbTesterProps() {
    return {
      ...this.sectionTesterProps,
      varbName: this.varbName,
    };
  }
  get setterVarbTestProps(): SetterVarbProps<SN> {
    return {
      varbName: this.varbName,
      ...this.setterSectionTestProps,
    };
  }
}
