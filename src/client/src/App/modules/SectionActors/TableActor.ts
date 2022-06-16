// make TableActor

import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { SectionArrQuerier } from "../QueriersBasic/SectionArrQuerier";
import { SectionActorBase } from "./SectionActorBase";

class GetterColumn extends GetterSection<"column"> {
  get displayNameOrNotFound(): string {
    const { varbInfoValues } = this.varbs;
    if (this.sections.hasSectionMixed(varbInfoValues)) {
      const varb = this.sections.varbByMixed(varbInfoValues);
      return varb.displayName;
    } else {
      return "Variable not found";
    }
  }
}

export class TableActor<
  SN extends SectionName<"tableName">
> extends SectionActorBase<SN> {
  get = new GetterSection(this.sectionActorBaseProps);
  tableState = new SetterTable(this.sectionActorBaseProps);
  get querier() {
    return new SectionArrQuerier(this.sectionActorBaseProps);
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker() {
    return new SectionPackMaker(this.sectionActorBaseProps);
  }
  private async sendTable(): Promise<void> {
    this.querier.replace([this.packMaker.makeSectionPack()]);
  }
  get rows(): GetterSection<"tableRow">[] {
    return this.get.children("tableRow");
  }
  get columns(): GetterColumn[] {
    return this.get.children("column").map((col) => {
      return new GetterColumn(col.getterSectionProps);
    });
  }
  get filteredRows() {
    const titleFilter = this.get.value("titleFilter", "string");
    return this.rows.filter((row) => {
      return row.value("title", "string").includes(titleFilter);
    });
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
