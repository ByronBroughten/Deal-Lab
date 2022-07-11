import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterMainSection } from "../../sharedWithServer/StateGetters/GetterMainSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTableNext } from "../../sharedWithServer/StateSetters/SetterTable";
import { IndexSectionQuerierProps } from "../QueriersRelative/Bases.ts/IndexSectionQuerierBase";
import { IndexListQuerier } from "../QueriersRelative/IndexListQuerier";
import { IndexSectionQuerier } from "../QueriersRelative/IndexSectionQuerier";
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionName<"tableSource">
> extends SectionActorBase<SN> {
  get = new GetterMainSection(this.sectionActorBaseProps);
  private get indexQuerierProps(): IndexSectionQuerierProps<SN> {
    return {
      ...this.sectionActorBaseProps,
      apiQueries: this.apiQueries,
      indexName: this.get.sectionName,
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
  get dbId(): string {
    return this.get.dbId;
  }
  get table(): SetterTableNext {
    const { main } = this.getterSections;
    const feStore = main.onlyChild("feStore");
    const { feTableStoreName } = this.get.meta;
    return new SetterTableNext({
      ...this.sectionActorBaseProps,
      ...feStore.onlyChild(feTableStoreName).feInfo,
    });
  }
  newDateTime(): string {
    return new Date().toISOString();
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
    const dateTime = this.newDateTime();
    this.setter.updateValues({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
    });
    this.setter.tryAndRevertIfFail(() =>
      this.indexSectionQuerier.saveNewToIndex()
    );
  }
  async saveUpdates(): Promise<void> {
    this.updateRow();
    this.setter.updateValues({
      dateTimeLastSaved: this.newDateTime(),
    });
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
      const varbInfo = col.value("varbInfo", "inEntityVarbInfo");
      if (!varbInfo) throw new Error("varbInfo not initialized");
      row.addCell(varbInfo, col.dbId);
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
