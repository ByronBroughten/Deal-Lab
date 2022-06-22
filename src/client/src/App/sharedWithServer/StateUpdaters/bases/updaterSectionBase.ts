import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "./../../StateGetters/GetterSection";

export class UpdaterSectionBase<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
}
