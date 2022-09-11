import { ChildSectionName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeStoreNameByType } from "../../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { SetterSection } from "../../../sharedWithServer/StateSetters/SetterSection";
import { SectionActorBase, SectionActorBaseProps } from "../SectionActorBase";
import { DisplayItemProps } from "./DisplayIndexActor";

interface FullIndexActorProps<SN extends FeStoreNameByType<"fullIndex">>
  extends SectionActorBaseProps<"feUser"> {
  itemName: SN;
}
export class FullIndexActor<
  SN extends FeStoreNameByType<"fullIndex">
> extends SectionActorBase<"feUser"> {
  itemName: SN;
  constructor({ itemName, ...rest }: FullIndexActorProps<SN>) {
    super(rest);
    this.itemName = itemName;
  }
  get setter() {
    return new SetterSection(this.setterSectionBase.setterSectionProps);
  }
  get displayItems(): DisplayItemProps[] {
    return this.get.children(this.itemName).map((section) => ({
      displayName: section.valueNext("displayName").text,
      dbId: section.dbId,
    }));
  }
  hasByDbId(dbId: string) {
    return this.get.hasChildByDbInfo({
      childName: this.itemName,
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.setter.removeChildByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  addItem(sectionPack: SectionPack<ChildSectionName<"feUser", SN>>): void {
    this.setter.loadChild({
      childName: this.itemName,
      sectionPack: sectionPack as SectionPack<any>,
    });
  }
  updateItem(sectionPack: SectionPack<ChildSectionName<"feUser", SN>>) {
    const child = this.setter.childByDbId({
      childName: this.itemName,
      dbId: sectionPack.dbId,
    });
    child.loadSelfSectionPack(sectionPack);
  }
}
