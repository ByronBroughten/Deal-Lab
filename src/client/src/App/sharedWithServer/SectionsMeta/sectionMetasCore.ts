import {
  baseSections,
  BaseSections,
  SimpleSectionName,
  simpleSectionNames,
} from "./baseSections";
import {
  BasePropName,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import {
  GeneralGeneratedSection,
  generatedSections,
  GeneratedSections,
  GenPropName,
} from "./generatedSections";
import { relSections, RelSections } from "./relSections";
import { GeneralRelSection, RelPropName } from "./relSectionsUtils/relSection";

type SectionMetasCoreGeneral = {
  [SN in SimpleSectionName]: GeneralRelSection &
    GeneralBaseSection &
    GeneralGeneratedSection;
};
export type SectionsMetaCore = {
  [SN in SimpleSectionName]: RelSections[SN] &
    BaseSections["fe"][SN] &
    GeneratedSections[SN];
};
export const sectionMetasCore = simpleSectionNames.reduce(
  (core, sectionName) => {
    (core as SectionMetasCoreGeneral)[sectionName] = {
      ...relSections[sectionName],
      ...baseSections["fe"][sectionName],
      ...generatedSections[sectionName],
    };
    return core;
  },
  {} as SectionsMetaCore
);

export type CorePropName = BasePropName | RelPropName | GenPropName;
