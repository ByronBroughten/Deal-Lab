import { DbSectionNameName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
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
import { SectionActorBase } from "./SectionActorBase";

export class MainSectionActor<
  SN extends SectionNameByType<"hasIndexStore">
> extends SectionActorBase<SN> {
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
  get hasDisplayIndex() {
    return this.get.meta.hasFeDisplayIndex;
  }
  get hasFullIndex() {
    return this.get.meta.hasFeFullIndex;
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
    const sectionPack = (await this.querier.get(dbId)) as SectionPack<SN>;
    this.mainSolver.loadSectionPack(sectionPack);
    this.setter.setSections();
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
