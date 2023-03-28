import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { GetterSection } from "./../StateGetters/GetterSection";
import { AddSolverSection } from "./AddSolverSection";
import { RemoveSolverSection } from "./RemoveSolverSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";

export class ComboSolverSection<
  SN extends SectionNameByType
> extends SolverSectionBase<SN> {
  get remover() {
    return RemoveSolverSection.init(this.solverSectionProps);
  }
  get adder() {
    return AddSolverSection.init(this.solverSectionProps);
  }
  get loader() {
    return new PackLoaderSection(this.solverSectionProps);
  }
  get get() {
    return new GetterSection(this.solverSectionProps);
  }
  loadSelfSectionPackAndExtractIds(sectionPack: SectionPack<SN>): void {
    this.remover.prepForRemoveAndExtractVarbIds();
    this.loader.loadSelfSectionPack(sectionPack);
    this.adder.finalizeAddedThisAndAll();
  }
  resetToDefaultAndExtractIds(): void {
    const { feInfo, feId, idx, dbId } = this.get;
    const { parent } = this.adder;
    const childName = parent.get.sectionChildName(feInfo);
    this.remover.removeSelfAndExtractVarbIds();
    parent.addChildAndFinalizeAllAdds(childName, { feId, idx, dbId });
  }
}
