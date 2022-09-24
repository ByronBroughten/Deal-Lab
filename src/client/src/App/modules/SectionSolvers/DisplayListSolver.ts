import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";

export type DisplayItemProps = { dbId: string; displayName: string };
export class DisplayListSolver extends SolverSectionBase<"displayNameList"> {
  get solver(): SolverSection<"displayNameList"> {
    return new SolverSection(this.solverSectionProps);
  }
  get get(): GetterSection<"displayNameList"> {
    return new GetterSection(this.getterSectionProps);
  }
  get itemDbIds(): string[] {
    return this.displayItems.map(({ dbId }) => dbId);
  }
  get displayItems(): DisplayItemProps[] {
    return this.get.children("displayNameItem").map((section) => ({
      displayName: section.valueNext("displayName"),
      dbId: section.dbId,
    }));
  }
  hasByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "displayNameItem",
      dbId,
    });
  }
  removeItem(dbId: string): void {
    this.solver.removeChildByDbIdAndSolve({
      childName: "displayNameItem",
      dbId,
    });
  }
  addItem({ dbId, displayName }: DisplayItemProps): void {
    this.solver.addChildAndSolve("displayNameItem", {
      dbId,
      dbVarbs: { displayName },
    });
  }
  updateItem({ dbId, displayName }: DisplayItemProps) {
    const item = this.solver.childByDbId({
      childName: "displayNameItem",
      dbId,
    });
    item.varb("displayName").directUpdateAndSolve(displayName);
  }
}
