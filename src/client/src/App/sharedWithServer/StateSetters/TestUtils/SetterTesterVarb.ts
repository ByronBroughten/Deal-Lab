import { VarbNames } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SetterVarb } from "../SetterVarb";
import {
  SetterTesterVarbBase,
  SetterTesterVarbProps,
} from "./Bases/SetterTesterVarbBase";
import { SetterTesterSection } from "./SetterTesterSection";

export class SetterTesterVarb<
  SN extends SectionName
> extends SetterTesterVarbBase<SN> {
  static initProps<S extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<S>): SetterTesterVarbProps<S> {
    return {
      ...SetterTesterSection.initProps(sectionName),
      varbName,
    };
  }
  static init<S extends SectionName>(props: VarbNames<S>): SetterTesterVarb<S> {
    return new SetterTesterVarb(this.initProps(props));
  }

  get setter(): SetterVarb<SN> {
    return new SetterVarb(this.setterVarbTestProps);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.setterVarbTestProps);
  }
}
