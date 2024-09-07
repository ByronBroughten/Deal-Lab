import { pick } from "lodash";
import { SectionNameByType } from "../../stateSchemas/SectionNameByType";
import { GetterSectionsBase, GetterSectionsProps } from "./GetterSectionsBase";

export interface GetterListProps<SN extends SectionNameByType>
  extends GetterSectionsProps {
  sectionName: SN;
}
export class GetterListBase<
  SN extends SectionNameByType
> extends GetterSectionsBase {
  readonly sectionName: SN;
  constructor({ sectionName, ...rest }: GetterListProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
  }
  get getterListProps(): GetterListProps<SN> {
    return pick(this, ["sectionName", "sectionsShare"]);
  }
  get sectionMeta() {
    return this.sectionsMeta.section(this.sectionName);
  }
}
