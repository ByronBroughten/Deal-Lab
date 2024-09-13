import {
  sectionParentNames,
  SectionToParentNameArrs,
} from "../../stateSchemas/fromSchema6SectionChildren/ParentName";
import {
  SectionName,
  sectionNames,
} from "../../stateSchemas/schema2SectionNames";
import {
  Schema2SectionStructures,
  schema2SectionStructures,
} from "../../stateSchemas/schema3SectionStructures";
import { GeneralBaseSectionVarbs } from "../../stateSchemas/schema3SectionStructures/baseSectionVarbs";
import {
  Schema3VariablesLogic,
  schema3VariablesLogic,
} from "../../stateSchemas/schema5VariablesLogic";
import { GeneralUpdateSectionVarbs } from "../../stateSchemas/schema5VariablesLogic/updateSectionVarbs";
import {
  Schema5SectionTraits,
  schema5SectionTraits,
} from "../../stateSchemas/schema7SectionTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "../../stateSchemas/schema7SectionTraits/sectionTraits";

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
  baseVarbs: Schema2SectionStructures[SN];
  relVarbs: Schema3VariablesLogic[SN];
} & GeneratedSections[SN] &
  Schema5SectionTraits[SN];

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
      baseVarbs: schema2SectionStructures[sectionName],
      relVarbs: schema3VariablesLogic[sectionName],
    },
    ...({
      ...generatedSections[sectionName],
      ...schema5SectionTraits[sectionName],
    } as any),
  } as any;
  return core;
}, {} as SectionsMetaCore);

export type CorePropName = GenPropName | SectionTraitName;
