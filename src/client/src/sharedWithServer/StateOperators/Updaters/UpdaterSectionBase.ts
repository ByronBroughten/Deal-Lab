import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { SectionName } from "../../stateSchemas/SectionName";

export class UpdaterSectionBase<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
}
