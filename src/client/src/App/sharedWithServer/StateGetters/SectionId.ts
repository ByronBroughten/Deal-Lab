import { Id } from "../SectionsMeta/IdS";
import { SectionName, validateSectionName } from "../SectionsMeta/SectionName";
import { Str } from "../utils/Str";

export const SectionId = {
  get sectionIdSplitter() {
    return "-";
  },
  makeSectionId(sectionName: SectionName, feId: string) {
    return `${sectionName}${this.sectionIdSplitter}${feId}`;
  },
  splitSectionId(sectionId: string): {
    sectionName: SectionName;
    feId: string;
  } {
    const [sectionName, feId] = sectionId.split(this.sectionIdSplitter);
    return { sectionName: sectionName as SectionName, feId };
  },
  validate(value: any): string {
    const str = Str.validate(value);
    const { sectionName, feId } = this.splitSectionId(str);
    validateSectionName(sectionName);
    Id.validate(feId);
    return str;
  },
};
