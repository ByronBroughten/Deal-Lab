import {
  sectionParentNames,
  SectionToParentNameArrs,
} from "./sectionChildrenDerived/ParentName";
import { SectionName, sectionNames } from "./SectionName";

export type GeneralGeneratedSection = {
  parentNames: string[];
};
type GeneratedSection<SN extends SectionName> = {
  parentNames: SectionToParentNameArrs[SN];
};
export type GenPropName = keyof GeneratedSection<SectionName>;

type GeneralGeneratedSections = {
  [SN in SectionName]: GeneralGeneratedSection;
};
export type GeneratedSections = {
  [SN in SectionName]: GeneratedSection<SN>;
};

export const generatedSections = sectionNames.reduce(
  (generatedSections, sectionName) => {
    generatedSections[sectionName] = {
      parentNames: sectionParentNames[sectionName],
    };
    return generatedSections;
  },
  {} as GeneralGeneratedSections
) as GeneratedSections;
