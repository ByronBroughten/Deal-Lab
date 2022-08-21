import { SectionValues } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { DbSectionNameName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { timeS } from "../../sharedWithServer/utils/date";
import {
  SectionQuerier,
  SectionQuerierProps,
} from "../QueriersBasic/SectionQuerier";
import { auth, UserInfoTokenProp } from "../services/authService";
import { ChildSectionNameName } from "./../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SetterSections } from "./../../sharedWithServer/StateSetters/SetterSections";
import { Str } from "./../../sharedWithServer/utils/Str";
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionName<"hasDisplayIndex">
> extends SectionActorBase<SN> {
  setter = new SetterSection(this.sectionActorBaseProps);
  // setter can't be a getter because its initial
  // sections would get messed up - that's probably depreciated advice.

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
  private get querier() {
    return new SectionQuerier(this.sectionQuerierProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get isSaved(): boolean {
    return this.displayNameList.get.hasChildByDbInfo({
      childName: "displayNameItem",
      dbId: this.dbId,
    });
  }
  get getterSections() {
    return new GetterSections(this.sectionActorBaseProps);
  }
  get setterSections() {
    return new SetterSections(this.sectionActorBaseProps);
  }
  get dbId(): string {
    return this.get.dbId;
  }
  alphabeticalDisplayItems() {
    const { displayNameList } = this;
    const nameSections = displayNameList.get.children("displayNameItem");
    const nameItems = nameSections.map((section) => ({
      displayName: section.valueNext("displayName"),
      dbId: section.dbId,
    }));
    return nameItems.sort((item1, item2) =>
      Str.compareAlphanumerically(item1.displayName, item2.displayName)
    );
  }
  private get table(): SetterTable {
    const { compareTableName } = this.get.meta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    return new SetterTable({
      ...this.sectionActorBaseProps,
      ...feUser.onlyChild(compareTableName).feInfo,
    });
  }
  get displayNameList(): SetterSection<"displayNameList"> {
    const { feDisplayIndexStoreName } = this.get.meta;
    const feUser = this.setterSections.oneAndOnly("feUser");
    return feUser.onlyChild(
      feDisplayIndexStoreName as ChildSectionNameName<
        "feUser",
        "displayNameList"
      >
    );
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
    titleVarb.updateValue("Copy of " + titleVarb.value("string"));
  }
  async saveAsNew() {
    this.setter.resetDbId();
    this.saveNew();
  }
  async copyAndSave() {
    this.makeACopy();
    this.saveNew();
  }
  async saveNew(): Promise<void> {
    this.addDisplayItem();
    const dateTime = timeS.now();
    this.setter.updateValues({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
    } as Partial<SectionValues<SN>>);

    let headers: UserInfoTokenProp | null = null;
    this.setter.tryAndRevertIfFail(async () => {
      const sectionPack = this.packMaker.makeSectionPack();
      const res = await this.querier.add(sectionPack as SectionPack<any>);
      headers = res.headers;
    });
    if (headers) auth.setTokenFromHeaders(headers);
  }
  async saveUpdates(): Promise<void> {
    this.updateDisplayItem();
    this.setter.updateValues({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
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
    this.displayNameList.removeChildByDbId({
      childName: "displayNameItem",
      dbId,
    });
    this.setter.tryAndRevertIfFail(async () => await this.querier.delete(dbId));
  }
  private get displayNameValue(): string {
    return this.get.valueNext("displayName");
  }
  private addDisplayItem(): void {
    const { dbId, displayNameValue } = this;
    this.displayNameList.addChild("displayNameItem", {
      dbId,
      dbVarbs: { displayName: displayNameValue },
    });
  }
  private updateDisplayItem() {
    const { dbId, displayNameValue, displayNameList } = this;
    const item = displayNameList.childByDbId({
      childName: "displayNameItem",
      dbId,
    });
    item.varb("displayName").updateValue(displayNameValue);
  }

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
  }
}
