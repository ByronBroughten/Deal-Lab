import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";

type SectionNameProp = { sectionName: SectionName<"dbStoreSection"> };
interface TableQueryActorProps extends SectionNameProp, StateQuerierBaseProps {}
class SectionQueryActor extends StateQuerierBase {
  sectionName: SectionName<"dbStoreSection">;
  constructor({ sectionName, ...rest }: TableQueryActorProps) {
    super(rest);
    this.sectionName = sectionName;
  }

  saveNew() {
    // do I need the sectionPack?
  }
  update() {
    // do I need the sectionPack?
  }

  // easy
  delete(dbId: string) {}
}
