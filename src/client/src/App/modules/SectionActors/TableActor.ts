// make TableActor

import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTableNext } from "../../sharedWithServer/StateSetters/SetterTable";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

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

// table actor and tableStoreActor will be very similar
// TableStoreActor

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
  // should table have sendTable?

  get = new GetterSection(this.sectionActorBaseProps);
  tableState = new SetterTableNext(this.sectionActorBaseProps);
  // get querier() {
  //   return new SectionQuerier(this.sectionActorBaseProps);
  // }
  // private async sendTable(): Promise<void> {
  //   this.querier.update(
  //     this.packMaker.makeSectionPack() as any as ServerSectionPack
  //   );
  // }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker() {
    return new SectionPackMaker(this.sectionActorBaseProps);
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
