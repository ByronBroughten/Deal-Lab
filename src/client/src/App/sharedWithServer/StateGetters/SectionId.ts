import { SectionName } from "../SectionsMeta/SectionName";

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
};
