import {
  DbNameBySectionName,
  DbStoreNameByType,
} from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterSections } from "../../sharedWithServer/StateSetters/SetterSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import {
  SectionQuerier,
  SectionQuerierProps,
} from "../QueriersBasic/SectionQuerier";
import { DisplayItemProps } from "../SectionSolvers/DisplayListBuilder";
import {
  MainSectionSolver,
  SaveStatus,
} from "../SectionSolvers/MainSectionSolver";
import { auth, UserInfoTokenProp } from "../services/authService";
import { Str } from "./../../sharedWithServer/utils/Str";
import { FeUserActor } from "./FeUserActor";
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionNameByType<"hasIndexStore">
> extends SectionActorBase<SN> {
  get feUser() {
    const feUser = this.setterSections.oneAndOnly("feUser").get;
    return new FeUserActor({
      ...this.sectionActorBaseProps,
      ...feUser.getterSectionProps,
    });
  }
  get mainSolver() {
    return new MainSectionSolver(this.sectionActorBaseProps);
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.sectionActorBaseProps);
  }
  get solver(): SolverSection<SN> {
    return new SolverSection(this.sectionActorBaseProps);
  }
  get setterSections(): SetterSections {
    return new SetterSections(this.sectionActorBaseProps);
  }
  get setter(): SetterSection<SN> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get hasFeDisplayIndex() {
    return this.get.meta.hasFeDisplayIndex;
  }
  private get sectionQuerierProps(): SectionQuerierProps<
    Extract<DbStoreNameByType<"sectionQuery">, DbNameBySectionName<SN>>
  > {
    return {
      apiQueries: this.apiQueries,
      dbStoreName: this.get.meta.dbIndexStoreName as Extract<
        DbStoreNameByType<"sectionQuery">,
        DbNameBySectionName<SN>
      >,
    };
  }
  private get querier() {
    return new SectionQuerier(this.sectionQuerierProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get isSaved(): boolean {
    return this.mainSolver.isSaved;
  }
  get asSavedPack(): SectionPack<SN> {
    return this.mainSolver.asSavedPack;
  }
  get saveStatus(): SaveStatus {
    return this.mainSolver.saveStatus;
  }
  alphabeticalDisplayItems() {
    const nameItems = this.displayItems;
    return nameItems.sort((item1, item2) =>
      Str.compareAlphanumerically(item1.displayName, item2.displayName)
    );
  }
  get displayItems(): DisplayItemProps[] {
    return this.mainSolver.displayItems;
  }
  setSections(): void {
    // can't user SetterSection in some cases after self is removed
    this.setterSections.setSections();
  }
  removeSelf(): void {
    this.mainSolver.removeSelf();
    this.setSections();
  }
  replaceWithDefault(): void {
    this.mainSolver.replaceWithDefault();
    this.setSections();
  }
  async makeACopy() {
    this.mainSolver.makeACopy();
    this.setSections();
  }
  async saveAsNew() {
    this.setter.resetDbId();
    this.saveNew();
  }
  async copyAndSave() {
    this.mainSolver.makeACopy();
    this.saveNew();
  }
  async saveNew(): Promise<void> {
    this.mainSolver.saveNew();
    this.setSections();
    let headers: UserInfoTokenProp | null = null;
    this.setter.tryAndRevertIfFail(async () => {
      const sectionPack = this.packMaker.makeSectionPack();
      const res = await this.querier.add(sectionPack as SectionPack<any>);
      headers = res.headers;
    });
    if (headers) auth.setTokenFromHeaders(headers);
  }
  private querySave() {
    let headers: UserInfoTokenProp | null = null;
    this.setter.tryAndRevertIfFail(async () => {
      const sectionPack = this.packMaker.makeSectionPack();
      const res = await this.querier.add(sectionPack as SectionPack<any>);
      headers = res.headers;
    });
    if (headers) auth.setTokenFromHeaders(headers);
  }
  async saveUpdates(): Promise<void> {
    this.mainSolver.saveUpdates();
    this.setter.setSections();
    this.setter.tryAndRevertIfFail(
      async () =>
        await this.querier.update(
          this.packMaker.makeSectionPack() as SectionPack<any>
        )
    );
  }
  async loadFromIndex(dbId: string): Promise<void> {
    await this.initLoad(dbId);
    this.setter.setSections();
  }
  async loadAndCopy(dbId: string): Promise<void> {
    await this.initLoad(dbId);
    this.mainSolver.copyMinusNameChange();
    this.setter.setSections();
  }
  private async initLoad(dbId: string) {
    const sectionPack = await this.loadByLogin(dbId);
    this.mainSolver.loadSectionPack(sectionPack);
  }
  private async loadByLogin(dbId: string): Promise<SectionPack<SN>> {
    if (this.feUser.isLoggedIn) {
      return (await this.querier.get(dbId)) as SectionPack<any>;
    } else {
      return this.mainSolver.indexSolver.getItem(dbId);
    }
  }
  async deleteSelf() {
    this.deleteFromIndex(this.get.dbId);
  }
  async deleteFromIndex(dbId: string) {
    this.mainSolver.deleteFromIndex(dbId);
    this.setter.setSections();
    this.setter.tryAndRevertIfFail(async () => await this.querier.delete(dbId));
  }
}
