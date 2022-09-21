import { AllSectionTraits, allSectionTraits } from "./allSectionTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "./allSectionTraits/sectionTraits";
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
    GeneralGeneratedSection &
    GeneralSectionTraits;
};
export type SectionsMetaCore = {
  [SN in SimpleSectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SimpleSectionName> = RelSections[SN] &
  BaseSections[SN] &
  GeneratedSections[SN] &
  AllSectionTraits[SN];

export const sectionMetasCore = simpleSectionNames.reduce(
  (core, sectionName) => {
    (core as SectionMetasCoreGeneral)[sectionName] = {
      ...{
        ...relSections[sectionName],
        ...baseSections[sectionName],
      },
      ...({
        ...generatedSections[sectionName],
        ...allSectionTraits[sectionName],
      } as any),
    } as any;
    return core;
  },
  {} as SectionsMetaCore
);

export type CorePropName =
  | BasePropName
  | RelPropName
  | GenPropName
  | SectionTraitName;
