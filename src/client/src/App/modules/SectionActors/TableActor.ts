// make TableActor

import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { DbStoreNameByType } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { StrictExtract, StrictOmit } from "../../sharedWithServer/utils/types";
import { CompareTableBuilder } from "../SectionSolvers/CompareTableBuilder";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

class GetterColumn extends GetterSection<"column"> {
  get displayNameOrNotFound(): string {
    const varbInfo = this.valueInEntityInfo();
    if (this.sections.hasSectionMixed(varbInfo)) {
      const varb = this.sections.varbByMixed(varbInfo);
      return varb.displayName;
    } else {
      return "Variable not found";
    }
  }
}

interface TableActorProps
  extends StrictOmit<SectionActorBaseProps<"compareTable">, "sectionName"> {
  rowSourceName: DbStoreNameByType<"mainIndex">;
}
export class TableActor extends SectionActorBase<"compareTable"> {
  readonly rowSourceName: DbStoreNameByType<"mainIndex">;
  constructor({ rowSourceName, ...props }: TableActorProps) {
    super({
      ...props,
      sectionName: "compareTable",
    });
    this.rowSourceName = rowSourceName;
  }
  get tableBuilder() {
    return new CompareTableBuilder(this.get.getterSectionProps);
  }
  get tableSetter(): SetterTable {
    return new SetterTable(this.sectionActorBaseProps);
  }
  async getRows() {
    const res = await this.apiQueries.getTableRows(
      makeReq({
        columns: this.tableBuilder.columnPacks,
        dbStoreName: this.rowSourceName,
      })
    );
    this.tableSetter.updateRows(res.data.tableRowPacks);
  }
  get get(): GetterSection<"compareTable"> {
    return new GetterSection(this.sectionActorBaseProps);
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get rows(): GetterSection<"tableRow">[] {
    return this.get.children("tableRow");
  }
  get compareRowProxies(): GetterSection<"proxyStoreItem">[] {
    const compareRows = this.get.children("compareRow");
    return compareRows.filter((row) =>
      this.tableBuilder.hasRowByDbId(row.valueNext("dbId"))
    );
  }
  get columns(): GetterColumn[] {
    return this.get.children("column").map((col) => {
      return new GetterColumn(col.getterSectionProps);
    });
  }
  get filteredRows() {
    const titleFilter = this.get.value("titleFilter", "string");
    return this.rows.filter((row) => {
      const passesTitleFilter = row
        .value("displayName", "string")
        .includes(titleFilter);
      const passesProxyFilter = !this.get.hasChildByValue({
        childName: "compareRow",
        varbName: "dbId",
        value: row.dbId,
      });
      return passesTitleFilter && passesProxyFilter;
    });
  }
  async sortRows(
    colIdOrTitle: string | StrictExtract<VarbName<"tableRow">, "displayName">,
    options: { reverse?: boolean } = {}
  ) {
    this.tableSetter.sortTableRowIdsByColumn(colIdOrTitle, options);
    // this.sendTable();
  }
  async removeColumn(columnFeId: string) {
    this.tableSetter.removeColumn(columnFeId);
    // this.sendTable();
  }
  async addColumn(entityInfo: InEntityVarbInfo) {
    const { setter } = this;
    // this is to initialize the setter's "initialSections"

    this.tableSetter.addColumn(entityInfo);
    setter.tryAndRevertIfFail(
      () => false
      // sendColumns
      // on the server, create and send back the new cells
      // add the cells to the existing rows
    );
  }
}
