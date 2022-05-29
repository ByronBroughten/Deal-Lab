import { pick } from "lodash";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionsBase, HasSectionsShare } from "./GetterSectionsBase";

export interface GetterListProps<SN extends SectionName>
  extends HasSectionsShare {
  sectionName: SN;
}
export class GetterListBase<SN extends SectionName> extends GetterSectionsBase {
  readonly sectionName: SN;
  constructor({ sectionName, sectionsShare }: GetterListProps<SN>) {
    super(sectionsShare);
    this.sectionName = sectionName;
  }
  get getterListProps(): GetterListProps<SN> {
    return pick(this, ["sectionName", "sectionsShare"]);
  }
}
