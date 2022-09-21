import { FeVarbInfo } from "../SectionsMeta/Info";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { HasSectionInfoProps } from "./HasSectionInfoProps";

export class HasVarbInfoProps<
  SN extends SectionNameByType<"hasVarb">
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
