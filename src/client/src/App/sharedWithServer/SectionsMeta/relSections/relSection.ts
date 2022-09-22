import { Merge } from "../../utils/Obj/merge";
import {
  sectionVarbNames,
  sectionVarbValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionName } from "../SectionName";
import { relVarb } from "./rel/relVarb";
import { GeneralRelVarbs, RelVarbs } from "./relVarbs";

type Options<SN extends SectionName> = Partial<RelVarbs<SN>>;

export function relSectionProp<
  SN extends SectionName,
  O extends Options<SN> = {}
>(
  sectionName: SN,
  options?: O
): { [S in SN]: RelSection<SN, Merge<RelVarbs<SN>, O>> } {
  return {
    [sectionName]: relSection({
      ...defaultRelSectionVarbs(sectionName),
      ...options,
    }),
  } as any;
}

export function relSection<SN extends SectionName, RV extends RelVarbs<SN>>(
  relVarbs: RV
): RelSection<SN, RV> {
  return {
    relVarbs,
  } as any;
}

export type RelSection<SN extends SectionName, O extends Options<SN> = {}> = {
  relVarbs: Merge<RelVarbs<SN>, O>;
};

export type RelPropName = keyof GeneralRelSection;
export type GeneralRelSection = {
  relVarbs: GeneralRelVarbs;
};

export type GenericRelSection<SN extends SectionName> = Merge<
  GeneralRelSection,
  {
    relVarbs: RelVarbs<SN>;
  }
>;

export type RelSectionVarbs<SN extends SectionName> = RelSection<
  SN,
  RelVarbs<SN>
>;
export function defaultRelSectionVarbs<SN extends SectionName>(
  sectionName: SN
): RelVarbs<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((relVarbs, varbName) => {
    const valueName = sectionVarbValueName(sectionName, varbName);
    relVarbs[varbName] = relVarb(valueName);
    return relVarbs;
  }, {} as RelVarbs<SN>);
}
