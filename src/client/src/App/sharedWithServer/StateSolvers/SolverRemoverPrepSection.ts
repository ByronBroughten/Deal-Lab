import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { OutVarbGetterSection } from "../StateInOutVarbs/OutVarbGetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import { SolverVarb } from "./SolverVarb";

export class SolverRemoverPrepSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private get inOut() {
    return new OutVarbGetterSection(this.getterSectionProps);
  }
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  private solverVarb(varbInfo: FeVarbInfo): SolverVarb {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...varbInfo,
    });
  }
  solverRemoverSection<S extends SectionName>(
    info: FeSectionInfo<S>
  ): SolverRemoverPrepSection<S> {
    return new SolverRemoverPrepSection({
      ...this.solverSectionsProps,
      ...info,
    });
  }
  child(
    childInfo: FeChildInfo<SN>
  ): SolverRemoverPrepSection<ChildSectionName<SN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.solverRemoverSection(feInfo);
  }
  removeChildArrs<CN extends ChildName<SN>>(childArrs: CN[]): void {
    for (const childName of childArrs) {
      this.removeChildren(childName);
    }
  }
  removeChildren(childName: ChildName<SN>): void {
    const childFeIds = this.get.childFeIds(childName);
    for (const feId of childFeIds) {
      this.removeChild({ childName, feId });
    }
  }
  removeChild<CN extends ChildName<SN>>(childInfo: FeChildInfo<SN, CN>): void {
    if (this.get.hasChild(childInfo)) {
      const child = this.child(childInfo);
      child.removeSelf();
    } else {
      const { childName, feId } = childInfo;
      throw new Error(
        `Section ${this.get.sectionName}.${this.get.feId} does not have child ${childName}.${feId}.`
      );
    }
  }
  removeSelf() {
    this.prepForRemoveSelf();
    this.updater.removeSelf();
  }
  prepForRemoveSelf() {
    const { selfAndDescendantActiveOutVarbIds } = this.inOut;
    this.addVarbIdsToSolveFor(...selfAndDescendantActiveOutVarbIds);

    const { selfAndDescendantVarbIds } = this.get;
    this.removeVarbIdsToSolveFor(...selfAndDescendantVarbIds);
    this.removeOutEntitiesOfAllInEntities();
  }
  private removeOutEntitiesOfAllInEntities() {
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.removeAllOutEntitiesOfInEntities();
    }
  }
}
