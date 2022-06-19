import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { HasSectionNameProp } from "./HasSectionNameProp";

export class HasSectionInfoProps<
  SN extends SectionName
> extends HasSectionNameProp<SN> {
  readonly feSectionInfo: FeSectionInfo<SN>;
  constructor({ sectionName, feId }: FeSectionInfo<SN>) {
    super(sectionName);
    this.feSectionInfo = { sectionName, feId };
  }
  get feId(): string {
    return this.feSectionInfo.feId;
  }
}
