import { allChildrenTraits } from "../../sharedWithServer/SectionsMeta/childrenTraits";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

export interface IndexTableRowActorProps
  extends StrictOmit<SectionActorBaseProps<"tableRow">, "sectionName"> {}

export class IndexTableRowActor extends SectionActorBase<"tableRow"> {
  dbStoreName: FeStoreNameByType<"dbIndexName">;
  constructor(props: IndexTableRowActorProps) {
    super({
      sectionName: "tableRow",
      ...props,
    });
    this.dbStoreName = this.initDbStoreName();
  }
  get parentTable(): SetterSection<"compareTable"> {
    const parentTable = this.setter.parent;
    if (parentTable.isOfType("compareTable")) {
      return parentTable;
    } else throw new Error("parent is not a compareTable");
  }
  get compareRowInfo() {
    return {
      childName: "compareRow",
      varbName: "dbId",
      value: this.get.dbId,
    } as const;
  }
  isCompared() {
    return this.parentTable.get.hasChildByValue(this.compareRowInfo);
  }
  toggleCompare() {
    if (this.isCompared()) {
      const compareRows = this.parentTable.childrenByValue(this.compareRowInfo);
      for (const row of compareRows) {
        row.update.removeSelf();
      }
      this.setter.setSections();
    } else {
      this.parentTable.addChild("compareRow", {
        dbVarbs: { dbId: this.get.dbId },
      });
    }
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  private initDbStoreName(): FeStoreNameByType<"dbIndexName"> {
    const parentSelfChildName = this.get.parent.selfChildName;
    if (feStoreNameS.is(parentSelfChildName, "mainTableName")) {
      return allChildrenTraits.feUser[parentSelfChildName].dbIndexName;
    } else throw new Error("This row doesn't have the right parent.");
  }
  get indexQuerier() {
    return new SectionQuerier({
      dbStoreName: this.dbStoreName,
      apiQueries: this.apiQueries,
    });
  }
  get cells(): GetterSection<"cell">[] {
    return this.get.children("cell");
  }
  deleteSelf() {
    this.setter.removeSelf();
    this.setter.tryAndRevertIfFail(() =>
      this.indexQuerier.delete(this.get.dbId)
    );
  }
}
