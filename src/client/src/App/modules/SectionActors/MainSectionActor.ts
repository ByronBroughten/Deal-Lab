import { SectionPack } from "../../sharedWithServer/SectionPack/SectionPack";
import { DbSectionNameName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import {
  SectionQuerier,
  SectionQuerierProps,
} from "../QueriersBasic/SectionQuerier";
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionName<"tableSource">
> extends SectionActorBase<SN> {
  private get sectionQuerierProps(): SectionQuerierProps<
    DbSectionNameName<SN>
  > {
    return {
      apiQueries: this.apiQueries,
      dbStoreName: this.get.meta.dbIndexStoreName as DbSectionNameName<SN>,
    };
  }
  get get() {
    return new GetterSection(this.sectionActorBaseProps);
  }
  get querier() {
    return new SectionQuerier(this.sectionQuerierProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
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
  get table(): SetterTable {
    const { main } = this.getterSections;
    const feStore = main.onlyChild("feStore");
    const { feTableIndexStoreName } = this.get.meta;
    return new SetterTable({
      ...this.sectionActorBaseProps,
      ...feStore.onlyChild(feTableIndexStoreName).feInfo,
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
  async makeACopy() {
    this.setter.resetDbId();
    const titleVarb = this.setter.varb("displayName");
    titleVarb.updateValueDirectly("Copy of " + titleVarb.value("string"));
  }
  async copyAndSave() {
    this.makeACopy();
    this.saveNew();
  }
  async saveNew(): Promise<void> {
    this.addStoreRow();
    const dateTime = this.newDateTime();
    this.setter.updateValues({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
    });
    this.setter.tryAndRevertIfFail(
      async () =>
        await this.querier.add(
          this.packMaker.makeSectionPack() as SectionPack<any>
        )
    );
  }
  async saveUpdates(): Promise<void> {
    this.updateRow();
    this.setter.updateValues({
      dateTimeLastSaved: this.newDateTime(),
    });
    this.setter.tryAndRevertIfFail(
      async () =>
        await this.querier.update(
          this.packMaker.makeSectionPack() as SectionPack<any>
        )
    );
  }
  async loadFromIndex(dbId: string): Promise<void> {
    const sectionPack = (await this.querier.get(dbId)) as SectionPack<SN>;
    this.setter.loadSelfSectionPack(sectionPack);
  }
  async deleteSelf() {
    this.deleteFromIndex(this.dbId);
  }
  async deleteFromIndex(dbId: string) {
    this.table.removeRow(dbId);
    this.setter.tryAndRevertIfFail(async () => await this.querier.delete(dbId));
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
      const entityInfo = col.valueInEntityInfo();
      row.addCell(entityInfo, col.dbId);
    }
  } // good enough, I guess.

  private addStoreRow(): void {
    const { table, dbId } = this;
    const rowIds = table.get.childDbIds("tableRow");
    if (rowIds.includes(dbId)) {
      throw new Error("Trying to save a new section that is already saved.");
    }
    table.addRow({
      displayName: this.get.value("displayName", "string"),
      dbId,
    });
    this.updateRow();
  }
}
