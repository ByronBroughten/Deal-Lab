import { SectionName } from "../../SectionsMeta/SectionName";
import { FocalSectionBase } from "../FocalSectionBase";
import { FocalVarbGetterProps, FocalVarbGetters } from "./FocalVarbGetters";

export class FocalVarbBase<
  SN extends SectionName<"hasVarb">
> extends FocalSectionBase<SN> {
  readonly varbName: string;
  constructor({ varbName, ...rest }: FocalVarbGetterProps<SN>) {
    super(rest);
    this.varbName = varbName;
  }
  get constructorProps(): FocalVarbGetterProps<SN> {
    return {
      varbName: this.varbName,
      ...this.self.constructorProps,
    };
  }
  selfVarb = new FocalVarbGetters(this.constructorProps);
}
