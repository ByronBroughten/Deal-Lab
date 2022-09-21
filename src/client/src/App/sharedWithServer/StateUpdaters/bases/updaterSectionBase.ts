import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "./../../StateGetters/GetterSection";

export class UpdaterSectionBase<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
}
