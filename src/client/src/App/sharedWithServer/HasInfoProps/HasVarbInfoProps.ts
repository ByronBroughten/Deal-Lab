import { FeVarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { HasSectionInfoProps } from "./HasSectionInfoProps";

export class HasVarbInfoProps<
  SN extends SectionName<"hasVarb">
> extends HasSectionInfoProps<SN> {
  readonly varbName: string;
  constructor(props: FeVarbInfo<SN>) {
    super(props);
    this.varbName = props.varbName;
  }
  get feVarbInfo(): FeVarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
}
