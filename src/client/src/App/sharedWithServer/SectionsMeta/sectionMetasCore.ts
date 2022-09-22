import { baseSectionsVarbs, BaseSectionsVarbs } from "./baseSectionsVarbs";
import { GeneralBaseSectionVarbs } from "./baseSectionsVarbs/baseSectionVarbs";
import {
  GeneralGeneratedSection,
  generatedSections,
  GeneratedSections,
  GenPropName,
} from "./generatedSections";
import { relSections, RelSections } from "./relSectionVarbs";
import { GeneralRelSectionVarbs } from "./relSectionVarbs/relSection";
import { SectionName, sectionNames } from "./SectionName";
import { AllSectionTraits, allSectionTraits } from "./sectionsTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "./sectionsTraits/sectionTraits";

type SectionMetaCoreGeneral = {
  baseVarbs: GeneralBaseSectionVarbs;
  relVarbs: GeneralRelSectionVarbs;
} & GeneralGeneratedSection &
  GeneralSectionTraits;

type SectionMetasCoreGeneral = {
  [SN in SectionName]: SectionMetaCoreGeneral;
};

export type SectionsMetaCore = {
  [SN in SectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SectionName> = {
  baseVarbs: BaseSectionsVarbs[SN];
  relVarbs: RelSections[SN];
} & GeneratedSections[SN] &
  AllSectionTraits[SN];

export const sectionMetasCore = sectionNames.reduce((core, sectionName) => {
  (core as SectionMetasCoreGeneral)[sectionName] = {
    ...{
      baseVarbs: baseSectionsVarbs[sectionName],
      relVarbs: relSections[sectionName],
    },
    ...({
      ...generatedSections[sectionName],
      ...allSectionTraits[sectionName],
    } as any),
  } as any;
  return core;
}, {} as SectionsMetaCore);

export type CorePropName = GenPropName | SectionTraitName;
