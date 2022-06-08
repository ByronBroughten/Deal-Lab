import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SetterSectionBase } from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";

export class SetterTableRow {}

export class TableRowActor<
  SN extends SectionName<"rowIndexNext">
> extends SetterSectionBase<SN> {
  get = new GetterSection(this.setterSectionProps);
  get setter() {
    return new SetterSection(this.setterSectionProps);
  }
  get querier() {
    return new SectionQuerier(this.get.sectionName);
  }
  deleteSelf() {
    this.setter.removeSelf();
    this.setter.tryAndRevertIfFail(() => this.querier.delete(this.get.dbId));
  }
}
