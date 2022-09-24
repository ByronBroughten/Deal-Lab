import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { DisplayItemProps } from "./DisplayListSolver";

interface FullIndexSolverProps<CN extends FeStoreNameByType<"fullIndex">>
  extends SolverSectionProps<"feUser"> {
  itemName: CN;
}
// these are going to be listGroups, remember.
export class FullIndexSolver<
  CN extends FeStoreNameByType<"fullIndex">
> extends SolverSectionBase<"feUser"> {
  itemName: CN;
  constructor({ itemName, ...rest }: FullIndexSolverProps<CN>) {
    super(rest);
    this.itemName = itemName;
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get solver() {
    return new SolverSection(this.solverSectionProps);
  }
  get displayItems(): DisplayItemProps[] {
    return this.get.children(this.itemName).map((section) => ({
      displayName: section.valueNext("displayName").mainText,
      dbId: section.dbId,
    }));
  }
  getItem(dbId: string): SolverSection<ChildSectionName<"feUser", CN>> {
    return this.solver.childByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  getItemPack(dbId: string): SectionPack<ChildSectionName<"feUser", CN>> {
    return this.getItem(dbId).packMaker.makeSectionPack();
  }
  hasByDbId(dbId: string) {
    return this.get.hasChildByDbInfo({
      childName: this.itemName,
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.solver.removeChildByDbIdAndSolve({
      childName: this.itemName,
      dbId,
    });
  }
  addItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>): void {
    this.solver.loadChildAndSolve({
      childName: this.itemName,
      sectionPack: sectionPack as SectionPack<any>,
    });
  }
  updateItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>) {
    const child = this.solver.childByDbId({
      childName: this.itemName,
      dbId: sectionPack.dbId,
    });
    child.loadSelfSectionPackAndSolve(sectionPack);
  }
}
