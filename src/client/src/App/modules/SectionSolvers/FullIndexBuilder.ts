import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { DisplayItemProps } from "./DisplayListBuilder";

interface FullIndexSolverProps<CN extends FeStoreNameByType<"fullIndex">>
  extends SolverSectionProps<"feUser"> {
  itemName: CN;
}
// these are going to be listGroups, remember.
export class FullIndexBuilder<
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
  get builder() {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get displayItems(): DisplayItemProps[] {
    return this.get.children(this.itemName).map((section) => ({
      displayName: section.valueNext("displayName").mainText,
      dbId: section.dbId,
    }));
  }
  getItem(dbId: string): PackBuilderSection<ChildSectionName<"feUser", CN>> {
    return this.builder.childByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  getItemPack(dbId: string): SectionPack<ChildSectionName<"feUser", CN>> {
    return this.getItem(dbId).makeSectionPack();
  }
  hasByDbId(dbId: string) {
    return this.get.hasChildByDbInfo({
      childName: this.itemName,
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.builder.removeChildByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  addItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>): void {
    this.builder.loadChild({
      childName: this.itemName,
      sectionPack: sectionPack,
    });
  }
  updateItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>) {
    const child = this.builder.childByDbId({
      childName: this.itemName,
      dbId: sectionPack.dbId,
    });
    child.loadSelf(sectionPack);
  }
}
