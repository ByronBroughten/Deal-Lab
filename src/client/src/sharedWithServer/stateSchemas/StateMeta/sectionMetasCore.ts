import {
  AllBaseSectionVarbs,
  allBaseSectionVarbs,
} from "../allBaseSectionVarbs";
import { GeneralBaseSectionVarbs } from "../allBaseSectionVarbs/baseSectionVarbs";
import { AllSectionTraits, allSectionTraits } from "../allSectionTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "../allSectionTraits/sectionTraits";
import { AllUpdateSections, allUpdateSections } from "../allUpdateSectionVarbs";
import { GeneralUpdateSectionVarbs } from "../allUpdateSectionVarbs/updateSectionVarbs";
import {
  sectionParentNames,
  SectionToParentNameArrs,
} from "../derivedFromChildrenSchemas/ParentName";
import { SectionName, sectionNames } from "../SectionName";

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

export const sectionMetasCore = sectionNames.reduce((core, sectionName) => {
  (core as SectionMetasCoreGeneral)[sectionName] = {
    ...{
      baseVarbs: allBaseSectionVarbs[sectionName],
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
