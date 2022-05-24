import { FocalSectionBase } from "../SectionFocal/FocalSectionBase";
import { SectionName } from "../SectionsMeta/SectionName";
import { FocalVarbGetterProps, GetterVarb } from "../StateGetters/GetterVarb";

export class FocalVarbBase<
  SN extends SectionName<"hasVarb">
> extends FocalSectionBase<SN> {
  readonly varbName: string;
  readonly selfVarb: GetterVarb<SN>;
  constructor({ varbName, ...rest }: FocalVarbGetterProps<SN>) {
    super(rest);
    this.varbName = varbName;
    this.selfVarb = new GetterVarb(this.constructorProps);
  }
  get constructorProps(): FocalVarbGetterProps<SN> {
    return {
      varbName: this.varbName,
      ...this.self.constructorProps,
    };
  }
}
