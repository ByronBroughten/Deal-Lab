// make TableActor

import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTableNext } from "../../sharedWithServer/StateSetters/SetterTableNext";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
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

interface TableActorProps
  extends StrictOmit<SectionActorBaseProps<"table">, "sectionName"> {}
export class TableActor extends SectionActorBase<"table"> {
  constructor(props: TableActorProps) {
    super({
      ...props,
      sectionName: "table",
    });
  }

  get = new GetterSection(this.sectionActorBaseProps);
  tableState = new SetterTableNext(this.sectionActorBaseProps);
  get querier() {
    return new SectionQuerier(this.sectionActorBaseProps);
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker() {
    return new SectionPackMaker(this.sectionActorBaseProps);
  }
  private async sendTable(): Promise<void> {
    this.querier.update(
      this.packMaker.makeSectionPack() as any as ServerSectionPack
    );
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
