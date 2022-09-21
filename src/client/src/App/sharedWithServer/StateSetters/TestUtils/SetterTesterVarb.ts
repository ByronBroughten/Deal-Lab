import { VarbNames } from "../../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SetterVarb } from "../SetterVarb";
import {
  SetterTesterVarbBase,
  SetterTesterVarbProps,
} from "./Bases/SetterTesterVarbBase";
import { SetterTesterSection } from "./SetterTesterSection";

export class SetterTesterVarb<
  SN extends SectionNameByType
> extends SetterTesterVarbBase<SN> {
  static initProps<S extends SectionNameByType>({
    sectionName,
    varbName,
  }: VarbNames<S>): SetterTesterVarbProps<S> {
    return {
      ...SetterTesterSection.initProps(sectionName),
      varbName,
    };
  }
  static init<S extends SectionNameByType>(
    props: VarbNames<S>
  ): SetterTesterVarb<S> {
    return new SetterTesterVarb(this.initProps(props));
  }

  get setter(): SetterVarb<SN> {
    return new SetterVarb(this.setterVarbTestProps);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.setterVarbTestProps);
  }
}
