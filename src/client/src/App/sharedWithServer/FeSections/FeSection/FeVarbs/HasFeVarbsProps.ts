import { SectionName } from "../../../SectionMetas/SectionName";
import { HasSectionInfoProps } from "../../HasSectionInfoProps";
import { FeVarbsCore } from "./FeVarbsCore";

export class HasFeVarbsProps<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  constructor(readonly core: FeVarbsCore<SN>) {
    super(core);
  }
}
