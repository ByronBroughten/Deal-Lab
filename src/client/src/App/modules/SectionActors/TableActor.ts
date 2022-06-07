// make TableActor

import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SetterSectionBase } from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { SectionArrQuerier } from "../QueriersBasic/SectionArrQuerier";

export class TableActor<
  SN extends SectionName<"tableName">
> extends SetterSectionBase<SN> {
  get = new GetterSection(this.setterSectionProps);
  tableState = new SetterTable(this.setterSectionProps);
  get querier() {
    return new SectionArrQuerier(this.get.sectionName);
  }
  get setter() {
    return new SetterSection(this.setterSectionProps);
  }
  get packMaker() {
    return new SectionPackMaker(this.setterSectionProps);
  }
  private async sendTable(): Promise<void> {
    this.querier.replace([this.packMaker.makeSectionPack()]);
  }
  // do I need to save the order of the sorted table rows?
  // I guess I might as well
  async sortRows(
    colIdOrTitle: string | "title",
    options: { reverse?: boolean } = {}
  ) {
    this.tableState.sortTableRowIdsByColumn(colIdOrTitle, options);
    this.sendTable();
  }
  async removeColumn(columnFeId: string) {
    this.tableState.removeColumn(columnFeId);
    this.sendTable();
  }
  async addColumn(entityInfo: InEntityVarbInfo) {
    const { setter } = this;
    // this is to initialize the setter's "initialSections"

    this.tableState.addColumn(entityInfo);
    setter.tryAndRevertIfFail(
      () => false
      // sendColumns
      // on the server, create and send back the new cells
      // add the cells to the existing rows
    );
  }
}
