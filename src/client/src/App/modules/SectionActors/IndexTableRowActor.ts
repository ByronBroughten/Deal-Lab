import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

interface IndexTableRowActorProps
  extends StrictOmit<SectionActorBaseProps<"tableRow">, "sectionName"> {
  indexName: SectionName<"rowIndexNext">;
}
export class IndexTableRowActor extends SectionActorBase<"tableRow"> {
  indexName: SectionName<"rowIndexNext">;
  constructor({ indexName, ...props }: IndexTableRowActorProps) {
    super({
      sectionName: "tableRow",
      ...props,
    });
    this.indexName = indexName;
  }
  get = new GetterSection(this.sectionActorBaseProps);
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get indexQuerier() {
    return new SectionQuerier({
      sectionName: this.indexName,
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
