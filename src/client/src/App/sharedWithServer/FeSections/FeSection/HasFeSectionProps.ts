import { HasSectionInfoProps } from "../../HasInfoProps/HasSectionInfoProps";
import { SectionName } from "../../SectionsMeta/SectionName";
import { FeSectionCore } from "./FeSectionCore";

export class HasFeSectionProps<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  constructor(readonly core: FeSectionCore<SN>) {
    super(core);
  }
}
