import { AllSectionTraits, allSectionTraits } from "./allSectionTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "./allSectionTraits/sectionTraits";
import { GeneralBaseSectionVarbs } from "./baseSectionsUtils/baseSectionVarbs";
import {
  BaseSectionsVarbs,
  baseSectionsVarbs,
  SimpleSectionName,
  simpleSectionNames,
} from "./baseSectionsVarbs";
import {
  GeneralGeneratedSection,
  generatedSections,
  GeneratedSections,
  GenPropName,
} from "./generatedSections";
import { relSections, RelSections } from "./relSections";
import { GeneralRelSection, RelPropName } from "./relSectionsUtils/relSection";

type SectionMetaCoreGeneral = {
  baseVarbs: GeneralBaseSectionVarbs;
} & GeneralRelSection &
  GeneralGeneratedSection &
  GeneralSectionTraits;

type SectionMetasCoreGeneral = {
  [SN in SimpleSectionName]: SectionMetaCoreGeneral;
};

export type SectionsMetaCore = {
  [SN in SimpleSectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SimpleSectionName> = {
  baseVarbs: BaseSectionsVarbs[SN];
} & RelSections[SN] &
  GeneratedSections[SN] &
  AllSectionTraits[SN];

export const sectionMetasCore = simpleSectionNames.reduce(
  (core, sectionName) => {
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
  },
  {} as SectionsMetaCore
);

export type CorePropName = RelPropName | GenPropName | SectionTraitName;
