import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  ChildSectionPackArrs,
  PackLoaderSection,
} from "../StatePackers.ts/PackLoaderSection";
import { Obj } from "../utils/Obj";
import { GetterSection } from "./../StateGetters/GetterSection";
import { AddSolverSection } from "./AddSolverSection";
import { RemoveSolverSection } from "./RemoveSolverSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";

export class ComboSolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  remover = RemoveSolverSection.init(this.solverSectionProps);
  adder = AddSolverSection.init(this.solverSectionProps);
  get loader() {
    return new PackLoaderSection(this.solverSectionProps);
  }
  get get() {
    return new GetterSection(this.solverSectionProps);
  }
  loadSelfSectionPackAndExtractIds(sectionPack: SectionPackRaw<SN>): void {
    this.remover.prepForRemoveAndExtractVarbIds();
    this.loader.updateSelfWithSectionPack(sectionPack);
    this.adder.finalizeAddAndExtractVarbIds();
  }
  loadChildPackArrsAndExtractIds(
    childPackArrs: Partial<ChildSectionPackArrs<SN>>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.remover.removeChildrenGroupsAndExtractVarbIds(childNames);
    for (const childName of childNames) {
      for (const childPack of (childPackArrs as ChildSectionPackArrs<SN>)[
        childName
      ]) {
        this.adder.loadChildAndCollectVarbIds(childPack);
      }
    }
    this.adder.finalizeVarbsAndExtractIds();
  }
  resetToDefaultAndExtractIds(): void {
    const { feId, idx, sectionName, dbId } = this.get;
    const { parent } = this.adder;
    this.remover.removeSelfAndExtractVarbIds();
    parent.addChildAndFinalize(sectionName as any, { feId, idx, dbId });
  }
}
