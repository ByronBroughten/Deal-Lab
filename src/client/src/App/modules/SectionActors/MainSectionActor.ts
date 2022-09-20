import { SectionValues } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { DbSectionNameName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import {
  SectionQuerier,
  SectionQuerierProps,
} from "../QueriersBasic/SectionQuerier";
import { auth, UserInfoTokenProp } from "../services/authService";
import { ChildSectionNameName } from "./../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SetterSections } from "./../../sharedWithServer/StateSetters/SetterSections";
import { Str } from "./../../sharedWithServer/utils/Str";
import {
  DisplayIndexActor,
  DisplayItemProps,
} from "./MainSectionActor/DisplayIndexActor";
import { FullIndexActor } from "./MainSectionActor/FullIndexActor";
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionName<"hasIndexStore">
> extends SectionActorBase<SN> {
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }

  get hasDisplayIndex() {
    return this.get.meta.hasFeDisplayIndex;
  }
  get hasFullIndex() {
    return this.get.meta.hasFeFullIndex;
  }
  get fullIndexActor(): FullIndexActor<any> {
    if (!this.hasFullIndex) {
      throw new Error(`${this.get.sectionName} has no full index store`);
    }
    const { feFullIndexStoreName } = this.get.meta;
    const feUser = this.setterSections.oneAndOnly("feUser");
    return new FullIndexActor({
      ...this.sectionActorBaseProps,
      ...feUser.feInfo,
      itemName: feFullIndexStoreName,
    }) as FullIndexActor<any>;
  }
  get displayIndexActor() {
    if (!this.hasDisplayIndex) {
      throw new Error(`${this.get.sectionName} has no display index store`);
    }
    const { feDisplayIndexStoreName } = this.get.meta;
    const feUser = this.setterSections.oneAndOnly("feUser");
    const list = feUser.onlyChild(
      feDisplayIndexStoreName as ChildSectionNameName<
        "feUser",
        "displayNameList"
      >
    );
    return new DisplayIndexActor({
      ...this.sectionActorBaseProps,
      ...list.feInfo,
    });
  }

  private get sectionQuerierProps(): SectionQuerierProps<
    DbSectionNameName<SN>
  > {
    return {
      apiQueries: this.apiQueries,
      dbStoreName: this.get.meta.dbIndexStoreName as DbSectionNameName<SN>,
    };
  }
  private get querier() {
    return new SectionQuerier(this.sectionQuerierProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get primaryActor(): DisplayIndexActor | FullIndexActor<any> {
    if (this.hasDisplayIndex) {
      return this.displayIndexActor;
    } else if (this.hasFullIndex) {
      return this.fullIndexActor;
    } else {
      throw new Error("There is no displayIndex nor fullIndex");
    }
  }
  get isSaved(): boolean {
    return this.primaryActor.hasByDbId(this.dbId);
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
    const nameItems = this.displayItems;
    return nameItems.sort((item1, item2) =>
      Str.compareAlphanumerically(item1.displayName, item2.displayName)
    );
  }
  get displayItems(): DisplayItemProps[] {
    if (this.hasDisplayIndex) {
      return this.displayIndexActor.displayItems;
    }
    if (this.get.meta.hasFeFullIndex) {
      return this.fullIndexActor.displayItems;
    }
    throw new Error(
      `section with sectionName "${this.get.sectionName}" has no feIndex`
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
    if (this.hasDisplayIndex) {
      this.addDisplayItem();
    }
    if (this.hasFullIndex) {
      this.addFullItem();
    }

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
    if (this.hasDisplayIndex) {
      this.updateDisplayItem();
    }
    if (this.hasFullIndex) {
      this.updateFullItem();
    }
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
    if (this.hasDisplayIndex) {
      this.displayIndexActor.removeItem(dbId);
    }
    if (this.hasFullIndex) {
      this.fullIndexActor.removeItem(dbId);
    }

    this.setter.tryAndRevertIfFail(async () => await this.querier.delete(dbId));
  }
  private get displayNameString(): string {
    return this.get.valueNext("displayName").mainText;
  }
  private addFullItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.fullIndexActor.addItem(sectionPack as SectionPack<any>);
  }
  private addDisplayItem(): void {
    const { dbId, displayNameString } = this;
    this.displayIndexActor.addItem({
      dbId,
      displayName: displayNameString,
    });
  }
  private updateFullItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.fullIndexActor.updateItem(sectionPack as SectionPack<any>);
  }
  private updateDisplayItem(): void {
    const { dbId, displayNameString } = this;
    this.displayIndexActor.updateItem({
      dbId,
      displayName: displayNameString,
    });
  }
}
