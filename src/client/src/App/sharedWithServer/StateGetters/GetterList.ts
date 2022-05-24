import { SectionNotFoundError } from "../../utils/error";
import { HasSectionNameProp } from "../HasInfoProps/HasSectionNameProp";
import {
  HasSharedSections,
  SharedSections,
} from "../HasInfoProps/HasSharedSectionsProp";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSections } from "../SectionsState/SectionsState";

interface GetterListProps<SN extends SectionName> extends HasSharedSections {
  sectionName: SN;
}

export class GetterListBase<
  SN extends SectionName
> extends HasSectionNameProp<SN> {
  readonly shared: SharedSections;
  constructor(props: GetterListProps<SN>) {
    super(props.sectionName);
    this.shared = props.shared;
  }
}

export class GetterList<SN extends SectionName> extends GetterListBase<SN> {
  get stateSections(): FeSections {
    return this.shared.sections;
  }
  get stateList() {
    return this.stateSections.list(this.sectionName).core.list;
  }
  idx(feId: string): number {
    const idx = this.stateList.findIndex((section) => section.feId === feId);
    if (idx < 0) throw this.sectionNotFoundError(feId);
    return idx;
  }
  sectionNotFoundError(id: string): SectionNotFoundError {
    return new SectionNotFoundError(
      `No section with sectionName ${this.sectionName} and id ${id}`
    );
  }
}
