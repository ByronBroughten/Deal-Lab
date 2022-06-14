import { sectionMetas } from "../../sharedWithServer/SectionsMeta";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterMainSection } from "../../sharedWithServer/StateGetters/GetterMainSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SetterSectionProps } from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { ApiQuerierProps } from "../QueriersBasic/ApiQuerierNext";
import { IndexListQuerier } from "../QueriersRelative/IndexListQuerier";
import {
  IndexSectionQuerier,
  IndexSectionQuerierProps,
} from "../QueriersRelative/IndexSectionQuerier";
import { SectionActorBase } from "./SectionActorBase";

interface Props<SN extends SectionName<"hasRowIndex">>
  extends SetterSectionProps<SN>,
    ApiQuerierProps {}

export class MainSectionActor<
  SN extends SectionName<"hasRowIndex">
> extends SectionActorBase<SN> {
  get = new GetterMainSection(this.sectionActorBaseProps);
  private get indexQuerierProps(): IndexSectionQuerierProps<SN> {
    return {
      ...this.sectionActorBaseProps,
      indexName: this.indexName,
    };
  }
  private get indexListQuerier() {
    return new IndexListQuerier(this.indexQuerierProps);
  }
  private get indexSectionQuerier() {
    return new IndexSectionQuerier(this.indexQuerierProps);
  }
  get isSaved(): boolean {
    return this.table.hasRowByDbId(this.dbId);
  }
  get setter(): SetterSection<SN> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get getterSections() {
    return new GetterSections(this.sectionActorBaseProps);
  }
  private get indexName(): SectionName<"rowIndexNext"> {
    return this.get.meta.get("rowIndexName");
  }
  private get indexTableName(): SectionName<"tableName"> {
    return sectionMetas.section(this.indexName).get("indexTableName");
  }
  get dbId(): string {
    return this.get.dbId;
  }
  get table(): SetterTable {
    const { main } = this.getterSections;
    return new SetterTable({
      ...this.sectionActorBaseProps,
      ...main.onlyChild(this.indexTableName).feInfo,
    });
  }
  removeSelf(): void {
    this.setter.removeSelf();
  }
  replaceWithDefault(): void {
    this.setter.replaceWithDefault();
  }
  resetToDefault(): void {
    this.setter.resetToDefault();
  }
  async saveNew(): Promise<void> {
    this.addRow();
    this.setter.tryAndRevertIfFail(() =>
      this.indexSectionQuerier.saveNewToIndex()
    );
  }
  async saveUpdates(): Promise<void> {
    this.updateRow();
    this.setter.tryAndRevertIfFail(() =>
      this.indexSectionQuerier.updateIndex()
    );
  }
  async loadFromIndex(dbId: string): Promise<void> {
    const sectionPack = await this.indexListQuerier.retriveFromIndex(dbId);
    this.setter.loadSelfSectionPack(sectionPack);
  }
  async deleteFromIndex() {
    await this.indexListQuerier.deleteFromIndex(this.dbId);
  }
  private updateRow(): void {
    // for greater efficiency, most of this could be done at the solver
    // section level to refrain from solving and setting the sections
    // until the end.
    const { table, dbId } = this;
    const row = table.rowByDbId(dbId);
    row.clearCells();
    const { columns } = table;
    for (const col of columns) {
      const { varbInfoValues } = col.varbs;
      const varbInfo = this.get.inEntityInfoToFeInfo(varbInfoValues);
      row.addCell(varbInfo);
    }
  }
  private addRow(): void {
    const { table, dbId } = this;
    table.addRow({
      title: this.get.value("title", "string"),
      dbId,
    });
    this.updateRow();
  }
}
