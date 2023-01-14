import {
  AllBaseSectionVarbs,
  baseSectionsVarbs,
  GeneralBaseSectionVarbs,
} from "./allBaseSectionVarbs";
import { AllSectionTraits, allSectionTraits } from "./allSectionTraits";
import { allUpdateSections, AllUpdateSections } from "./allUpdateSectionVarbs";
import {
  GeneralGeneratedSection,
  generatedSections,
  GeneratedSections,
  GenPropName,
} from "./generatedSections";
import { GeneralUpdateSectionVarbs } from "./relSectionVarbs/updateVarbs";
import { SectionName, sectionNames } from "./SectionName";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "./sectionsTraits/sectionTraits";

type SectionMetaCoreGeneral = {
  baseVarbs: GeneralBaseSectionVarbs;
  relVarbs: GeneralUpdateSectionVarbs;
} & GeneralGeneratedSection &
  GeneralSectionTraits;

type SectionMetasCoreGeneral = {
  [SN in SectionName]: SectionMetaCoreGeneral;
};

export type SectionsMetaCore = {
  [SN in SectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SectionName> = {
  baseVarbs: AllBaseSectionVarbs[SN];
  relVarbs: AllUpdateSections[SN];
} & GeneratedSections[SN] &
  AllSectionTraits[SN];

export const sectionMetasCore = sectionNames.reduce((core, sectionName) => {
  (core as SectionMetasCoreGeneral)[sectionName] = {
    ...{
      baseVarbs: baseSectionsVarbs[sectionName],
      relVarbs: allUpdateSections[sectionName],
    },
    ...({
      ...generatedSections[sectionName],
      ...allSectionTraits[sectionName],
    } as any),
  } as any;
  return core;
}, {} as SectionsMetaCore);

export type CorePropName = GenPropName | SectionTraitName;
