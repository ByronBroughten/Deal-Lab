import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionValues } from "../SectionsMeta/values/StateValue";
import { GetterSection } from "../StateGetters/GetterSection";
import {
  ChildSectionPackArrs,
  LoadChildProps,
} from "../StatePackers/PackLoaderSection";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import {
  FeSectionInfo,
  FeVarbInfo,
} from "./../SectionsMeta/SectionInfo/FeInfo";
import { SolverAdderPrepSection } from "./SolverAdderPrepSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import { SolverPrepSections } from "./SolverPrepSections";
import { SolverRemoverPrepSection } from "./SolverRemoverPrepSection";
import { SolverVarb } from "./SolverVarb";

export class SolverPrepSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private solverVarb(varbInfo: FeVarbInfo): SolverVarb {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...varbInfo,
    });
  }
  get prepperSections(): SolverPrepSections {
    return new SolverPrepSections(this.solverSectionsProps);
  }
  get basicSolvePrepper(): SolverAdderPrepSection<SN> {
    return new SolverAdderPrepSection(this.solverSectionProps);
  }
  get removerPrepper(): SolverRemoverPrepSection<SN> {
    return new SolverRemoverPrepSection(this.solverSectionProps);
  }
  addAppWideMissingOutEntities() {
    this.prepperSections.addAppWideMissingOutEntities();
  }
  solverPrepSection<S extends SectionName>(
    info: FeSectionInfo<S>
  ): SolverPrepSection<S> {
    return new SolverPrepSection({
      ...this.solverSectionsProps,
      ...info,
    });
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SolverPrepSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.solverPrepSection(feInfo);
  }
  children<CN extends ChildName<SN>>(
    childName: CN
  ): SolverPrepSection<ChildSectionName<SN, CN>>[] {
    const getters = this.get.children(childName);
    return getters.map(({ feInfo }) => this.solverPrepSection(feInfo));
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: CN
  ): SolverPrepSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.solverPrepSection(feInfo);
  }
  updateValues(values: Partial<SectionValues<SN>>): void {
    const varbNames = Obj.keys(values) as VarbName<SN>[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));
    for (const varbInfo of varbInfos) {
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.removeAllOutEntitiesOfInEntities();
    }
    this.basicSolvePrepper.updateValues(values);
    this.addAppWideMissingOutEntities();
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>): void {
    this.basicSolvePrepper.loadSelfSectionPack(sectionPack);
    this.addAppWideMissingOutEntities();
  }
  resetToDefault(): void {
    this.basicSolvePrepper.resetToDefault();
    this.addAppWideMissingOutEntities();
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ) {
    this.basicSolvePrepper.addChild(childName, options);
    this.addAppWideMissingOutEntities();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ) {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  loadChild<CN extends ChildName<SN>>(packInfo: LoadChildProps<SN, CN>): void {
    this.basicSolvePrepper.loadChild(packInfo);
    this.addAppWideMissingOutEntities();
  }
  loadChildArrs<CN extends ChildName<SN>>(
    packArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    this.basicSolvePrepper.loadChildArrs(packArrs);
    this.addAppWideMissingOutEntities();
  }
  replaceChildPackArrs<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    this.basicSolvePrepper.replaceChildPackArrs(childPackArrs);
    this.addAppWideMissingOutEntities();
  }
  removeChildArrs<CN extends ChildName<SN>>(childArrs: CN[]): void {
    this.removerPrepper.removeChildArrs(childArrs);
  }
  removeChildren(childName: ChildName<SN>): void {
    this.removerPrepper.removeChildren(childName);
  }
  removeChild<CN extends ChildName<SN>>(childInfo: FeChildInfo<SN, CN>): void {
    this.removerPrepper.removeChild(childInfo);
  }
  removeChildByDbId<CN extends ChildName<SN>>(
    dbInfo: DbChildInfo<SN, CN>
  ): void {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    this.removerPrepper.removeChild({ childName, feId });
  }
  removeSelf() {
    this.removerPrepper.removeSelf();
  }
}
