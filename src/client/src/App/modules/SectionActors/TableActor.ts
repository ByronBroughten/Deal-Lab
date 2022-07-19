// make TableActor

import { SectionVarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/entities";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { StrictExtract, StrictOmit } from "../../sharedWithServer/utils/types";
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
  extends StrictOmit<SectionActorBaseProps<"table">, "sectionName"> {
  sendTable: () => void;
}
export class TableActor extends SectionActorBase<"table"> {
  sendTable: () => void;
  constructor({ sendTable, ...rest }: TableActorProps) {
    super({
      ...rest,
      sectionName: "table",
    });
    this.sendTable = sendTable;
  }
  get get(): GetterSection<"table"> {
    return new GetterSection(this.sectionActorBaseProps);
  }
  get tableState(): SetterTable {
    return new SetterTable(this.sectionActorBaseProps);
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
  get columns(): GetterColumn[] {
    return this.get.children("column").map((col) => {
      return new GetterColumn(col.getterSectionProps);
    });
  }
  get filteredRows() {
    const titleFilter = this.get.value("titleFilter", "string");
    return this.rows.filter((row) => {
      return row.value("displayName", "string").includes(titleFilter);
    });
  }
  // do I need to save the order of the sorted table rows?
  // I guess I might as well
  async sortRows(
    colIdOrTitle:
      | string
      | StrictExtract<SectionVarbName<"tableRow">, "displayName">,
    options: { reverse?: boolean } = {}
  ) {
    this.tableState.sortTableRowIdsByColumn(colIdOrTitle, options);
    // this.sendTable();
  }
  async removeColumn(columnFeId: string) {
    this.tableState.removeColumn(columnFeId);
    // this.sendTable();
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
