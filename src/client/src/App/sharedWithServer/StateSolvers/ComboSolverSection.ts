import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
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
  replaceChildPackArrsAndFinalize<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.remover.removeChildrenGroupsAndExtractVarbIds(childNames);
    this.adder.loadChildArrsAndFinalize(childPackArrs);
  }
  resetToDefaultAndExtractIds(): void {
    const { feInfo, feId, idx, dbId } = this.get;
    const { parent } = this.adder;
    const childName = parent.get.sectionChildName(feInfo);
    this.remover.removeSelfAndExtractVarbIds();
    parent.addChildAndFinalizeAllAdds(childName, { feId, idx, dbId });
  }
}
