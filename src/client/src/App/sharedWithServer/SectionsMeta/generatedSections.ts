import { Obj } from "../utils/Obj";
import { SimpleSectionName, simpleSectionNames } from "./baseSections";
import { tableSourceParams } from "./relNameArrs/tableStoreArrs";
import {
  sectionParentNames,
  SectionToParentNameArrs,
} from "./relSectionTypes/ParentTypes";

export const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

export const allTableSourceParams = Obj.merge(allNull, tableSourceParams);
type AllTableSourceParams = typeof allTableSourceParams;

export type GeneralGeneratedSection = {
  tableSourceName: string | null;
  parentNames: string[];
};
type GeneratedSection<SN extends SimpleSectionName> = {
  tableSourceName: AllTableSourceParams[SN];
  parentNames: SectionToParentNameArrs[SN];
};
export type GenPropName = keyof GeneratedSection<SimpleSectionName>;

type GeneralGeneratedSections = {
  [SN in SimpleSectionName]: GeneralGeneratedSection;
};
export type GeneratedSections = {
  [SN in SimpleSectionName]: GeneratedSection<SN>;
};

export const generatedSections = simpleSectionNames.reduce(
  (generatedSections, sectionName) => {
    generatedSections[sectionName] = {
      tableSourceName: allTableSourceParams[sectionName],
      parentNames: sectionParentNames[sectionName],
    };
    return generatedSections;
  },
  {} as GeneralGeneratedSections
) as GeneratedSections;
