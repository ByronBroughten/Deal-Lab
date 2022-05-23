import { SectionName } from "../../SectionsMeta/SectionName";
import { FocalSectionBase } from "../FocalSectionBase";
import { FocalVarbGetterProps, FocalVarbGetters } from "./FocalVarbGetters";

export class FocalVarbBase<
  SN extends SectionName<"hasVarb">
> extends FocalSectionBase<SN> {
  readonly varbName: string;
  readonly selfVarb: FocalVarbGetters<SN>;
  constructor({ varbName, ...rest }: FocalVarbGetterProps<SN>) {
    super(rest);
    this.varbName = varbName;
    this.selfVarb = new FocalVarbGetters(this.constructorProps);
  }
  get constructorProps(): FocalVarbGetterProps<SN> {
    return {
      varbName: this.varbName,
      ...this.self.constructorProps,
    };
  }
}
