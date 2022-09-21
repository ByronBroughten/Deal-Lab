import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { HasSectionNameProp } from "./HasSectionNameProp";

export class HasSectionInfoProps<
  SN extends SectionNameByType
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
