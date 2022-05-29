import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterVarbBase } from "../../StateGetters/Bases/GetterVarbBase";
import { SetterSectionBase, SetterSectionProps } from "./SetterSectionBase";

export interface SetterVarbProps<SN extends SectionName>
  extends SetterSectionProps<SN> {
  varbName: string;
}

export class SetterVarbBase<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  readonly getterVarbBase: GetterVarbBase<SN>;
  constructor(props: SetterVarbProps<SN>) {
    super(props);
    this.getterVarbBase = new GetterVarbBase(props);
  }
}
