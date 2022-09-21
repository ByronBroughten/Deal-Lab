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
  remover = RemoveSolverSection.init(this.solverSectionProps);
  adder = AddSolverSection.init(this.solverSectionProps);
  get loader() {
    return new PackLoaderSection(this.solverSectionProps);
  }
  get get() {
    return new GetterSection(this.solverSectionProps);
  }
  loadSelfSectionPackAndExtractIds(sectionPack: SectionPack<SN>): void {
    this.remover.prepForRemoveAndExtractVarbIds();
    this.loader.loadSelfSectionPack(sectionPack);
    this.adder.finalizeAddAndExtractVarbIds();
  }
  loadChildPackArrsAndExtractIds(
    childPackArrs: Partial<ChildSectionPackArrs<SN>>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    // when I log in, this isn't really solving everything
    this.remover.removeChildrenGroupsAndExtractVarbIds(childNames);

    for (const childName of childNames) {
      for (const sectionPack of (childPackArrs as ChildSectionPackArrs<SN>)[
        childName
      ]) {
        this.adder.loadChildAndCollectVarbIds({
          childName,
          sectionPack,
        });
      }
    }
    this.adder.finalizeVarbsAndExtractIds();
  }
  resetToDefaultAndExtractIds(): void {
    const { feInfo, feId, idx, dbId } = this.get;
    const { parent } = this.adder;
    const childName = parent.get.sectionChildName(feInfo);
    this.remover.removeSelfAndExtractVarbIds();
    parent.addChildAndFinalize(childName, { feId, idx, dbId });
  }
}
