import { HasSectionInfoProps } from "../../../HasInfoProps/HasSectionInfoProps";
import { SectionName } from "../../../SectionsMeta/SectionName";
import { FeVarbsCore } from "./FeVarbsCore";

export class HasFeVarbsProps<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  constructor(readonly core: FeVarbsCore<SN>) {
    super(core);
  }
}
