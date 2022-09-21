import { SectionNameByType } from "../SectionsMeta/SectionNameByType";

export class HasSectionNameProp<SN extends SectionNameByType> {
  constructor(readonly sectionName: SN) {}
}
