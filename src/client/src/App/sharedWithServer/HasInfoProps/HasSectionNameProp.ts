import { SectionName } from "../SectionsMeta/SectionName";

export class HasSectionNameProp<SN extends SectionName> {
  constructor(readonly sectionName: SN) {}
}
