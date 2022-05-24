import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { HasSectionInfoProps } from "./HasSectionInfoProps";

export class HasVarbInfoProps<
  SN extends SectionName<"hasVarb">
> extends HasSectionInfoProps<SN> {
  readonly varbName: string;
  constructor(props: VarbInfo<SN>) {
    super(props);
    this.varbName = props.varbName;
  }
  get feVarbInfo(): VarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
}
