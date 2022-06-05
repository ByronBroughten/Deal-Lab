import { pick } from "lodash";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionsBase, GetterSectionsProps } from "./GetterSectionsBase";

export interface GetterListProps<SN extends SectionName>
  extends GetterSectionsProps {
  sectionName: SN;
}
export class GetterListBase<SN extends SectionName> extends GetterSectionsBase {
  readonly sectionName: SN;
  constructor({ sectionName, ...rest }: GetterListProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
  }
  get getterListProps(): GetterListProps<SN> {
    return pick(this, ["sectionName", "sectionsShare"]);
  }
}
