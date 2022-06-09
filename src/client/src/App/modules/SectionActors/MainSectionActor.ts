import { sectionMetas } from "../../sharedWithServer/SectionsMeta";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterMainSection } from "../../sharedWithServer/StateGetters/GetterMainSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SetterSectionBase } from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { IndexListQuerier } from "../QueriersRelative/IndexListQuerier";
import { IndexSectionQuerier } from "../QueriersRelative/IndexSectionQuerier";

export class MainSectionActor<
  SN extends SectionName<"hasRowIndex">
> extends SetterSectionBase<SN> {
  get indexSectionQuerier() {
    return new IndexSectionQuerier({
      ...this.setterSectionProps,
      indexName: this.indexName,
    });
  }
  get = new GetterMainSection(this.setterSectionProps);
  get indexListQuerier() {
    return new IndexListQuerier({
      ...this.setterSectionProps,
      indexName: this.indexName,
    });
  }
  get isSaved(): boolean {
    return this.table.hasRowByDbId(this.dbId);
  }
  get setter(): SetterSection<SN> {
    return new SetterSection(this.setterSectionProps);
  }
  get getterSections() {
    return new GetterSections(this.setterSectionsProps);
  }
  private get indexName(): SectionName<"rowIndexNext"> {
    return this.setter.meta.get("rowIndexName");
  }
  private get indexTableName(): SectionName<"tableName"> {
    return sectionMetas.section(this.indexName).get("indexTableName");
  }
  get dbId(): string {
    return this.get.dbId;
  }
  private get table(): SetterTable {
    const { main } = this.getterSections;
    return new SetterTable({
      ...this.setterSectionsProps,
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
