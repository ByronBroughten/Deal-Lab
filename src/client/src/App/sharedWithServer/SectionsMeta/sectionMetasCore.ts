import { AllSectionTraits, allSectionTraits } from "./allSectionTraits";
import { baseSectionsVarbs, BaseSectionsVarbs } from "./baseSectionsVarbs";
import { GeneralBaseSectionVarbs } from "./baseSectionsVarbs/baseSectionVarbs";
import {
  GeneralGeneratedSection,
  generatedSections,
  GeneratedSections,
  GenPropName,
} from "./generatedSections";
import { relSections, RelSections } from "./relSections";
import { GeneralRelSection, RelPropName } from "./relSections/relSection";
import { SectionName, sectionNames } from "./SectionName";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "./sectionsTraits/sectionTraits";

type SectionMetaCoreGeneral = {
  baseVarbs: GeneralBaseSectionVarbs;
} & GeneralRelSection &
  GeneralGeneratedSection &
  GeneralSectionTraits;

type SectionMetasCoreGeneral = {
  [SN in SectionName]: SectionMetaCoreGeneral;
};

export type SectionsMetaCore = {
  [SN in SectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SectionName> = {
  baseVarbs: BaseSectionsVarbs[SN];
} & RelSections[SN] &
  GeneratedSections[SN] &
  AllSectionTraits[SN];

export const sectionMetasCore = sectionNames.reduce((core, sectionName) => {
  (core as SectionMetasCoreGeneral)[sectionName] = {
    ...{
      ...relSections[sectionName],
      baseVarbs: baseSectionsVarbs[sectionName],
    },
    ...({
      ...generatedSections[sectionName],
      ...allSectionTraits[sectionName],
    } as any),
  } as any;
  return core;
}, {} as SectionsMetaCore);

export type CorePropName = RelPropName | GenPropName | SectionTraitName;
