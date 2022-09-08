import {
  isFeUserTableName,
  relChildSections,
} from "../../sharedWithServer/SectionsMeta/relChildSections";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

export interface IndexTableRowActorProps
  extends StrictOmit<SectionActorBaseProps<"tableRow">, "sectionName"> {}

export class IndexTableRowActor extends SectionActorBase<"tableRow"> {
  dbStoreName: FeStoreNameByType<"partialIndexDbSource">;
  constructor(props: IndexTableRowActorProps) {
    super({
      sectionName: "tableRow",
      ...props,
    });
    this.dbStoreName = this.initDbStoreName();
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  private initDbStoreName(): FeStoreNameByType<"partialIndexDbSource"> {
    const parentSelfChildName = this.get.parent.selfChildName;
    if (isFeUserTableName(parentSelfChildName)) {
      return relChildSections.feUser[parentSelfChildName].partialIndexDbSource;
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
