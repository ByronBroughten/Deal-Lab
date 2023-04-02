import {
  DbNameBySectionName,
  DbStoreNameByType,
} from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StoreName } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { PackMakerSection } from "../../sharedWithServer/StatePackers/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterSections } from "../../sharedWithServer/StateSetters/SetterSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import {
  SectionQuerier,
  SectionQuerierProps,
} from "../QueriersBasic/SectionQuerier";
import { DisplayItemProps } from "../SectionSolvers/FeIndexSolver";
import {
  MainSectionSolver,
  SaveStatus,
} from "../SectionSolvers/MainSectionSolver";
import { UserInfoTokenProp, userTokenS } from "../services/userTokenS";
import { Str } from "./../../sharedWithServer/utils/Str";
import { FeStoreActor } from "./FeStoreActor";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

type DbIndexStoreName<SN extends SectionNameByType<"hasIndexStore">> = Extract<
  DbStoreNameByType<"sectionQuery">,
  DbNameBySectionName<SN>
>;

export class MainSectionActor<
  SN extends SectionNameByType<"hasIndexStore">
> extends SectionActorBase<SN> {
  mainStoreName: StoreName<SN>;
  constructor(props: SectionActorBaseProps<SN>) {
    super(props);
    this.mainStoreName = this.get.mainStoreName as StoreName<SN>;
    // this is a property so the section can delete itself.
  }
  get feStore() {
    const feStore = this.setterSections.oneAndOnly("feStore").get;
    return new FeStoreActor({
      ...this.sectionActorBaseProps,
      ...feStore.getterSectionProps,
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
  private get sectionQuerierProps(): SectionQuerierProps<StoreName<SN>> {
    return {
      apiQueries: this.apiQueries,
      dbStoreName: this.mainStoreName,
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
    const clonePack = this.mainSolver.makeACopy();
    this.setSections();
    this.tryAddSectionQuery(clonePack);
  }
  async makeSelfACopy() {
    this.mainSolver.makeSelfACopy();
    this.setSections();
  }
  async saveAsNew() {
    this.setter.resetDbId();
    this.saveSelfNew();
  }
  async makeSelfACopyAndSave() {
    this.mainSolver.makeSelfACopy();
    this.saveSelfNew();
  }
  private async tryAddSectionQuery(sectionPack: SectionPack<SN>) {
    let headers: UserInfoTokenProp | null = null;
    this.setter.tryAndRevertIfFail(async () => {
      const res = await this.querier.add(sectionPack as SectionPack<any>);
      headers = res.headers;
    });
    if (headers) userTokenS.setTokenFromHeaders(headers);
  }
  async saveSelfNew(): Promise<void> {
    this.mainSolver.saveSelfNew();
    this.setSections();
    const sectionPack = this.packMaker.makeSectionPack();
    this.tryAddSectionQuery(sectionPack);
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
    if (this.feStore.isLoggedIn) {
      return (await this.querier.get(dbId)) as SectionPack<any>;
    } else {
      return this.mainSolver.storeSolver.getItemPack(dbId);
    }
  }
  async deleteSelf() {
    this.deleteFromIndex(this.get.dbId);
  }
  async deleteFromIndex(dbId: string) {
    this.mainSolver.deleteFromIndex(dbId);
    this.setterSections.setSections();
    this.setterSections.tryAndRevertIfFail(
      async () => await this.querier.delete(dbId)
    );
  }
}
