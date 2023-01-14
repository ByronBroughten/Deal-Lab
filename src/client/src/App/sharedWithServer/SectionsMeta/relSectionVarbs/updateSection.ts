import { Merge } from "../../utils/Obj/merge";
import {
  getBaseVarb,
  sectionVarbNames,
  sectionVarbValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { GeneralBaseVarb } from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import { calculatedRounding, updateVarb } from "./rel/updateVarb";
import { UpdateSectionVarbs } from "./updateVarbs";

type Options<SN extends SectionName> = Partial<UpdateSectionVarbs<SN>>;

export function updateSectionProp<
  SN extends SectionName,
  O extends Options<SN> = {}
>(
  sectionName: SN,
  options?: O
): { [S in SN]: RelSection<SN, Merge<UpdateSectionVarbs<SN>, O>> } {
  return {
    [sectionName]: updateSection({
      ...defaultSectionUpdateVarbs(sectionName),
      ...options,
    }),
  } as any;
}

function updateSection<
  SN extends SectionName,
  RV extends UpdateSectionVarbs<SN>
>(relVarbs: RV): RelSection<SN, RV> {
  return relVarbs as any;
}

export type RelSection<
  SN extends SectionName,
  O extends Options<SN> = {}
> = Merge<UpdateSectionVarbs<SN>, O>;

export type GenericRelSection<SN extends SectionName> = UpdateSectionVarbs<SN>;

export function defaultSectionUpdateVarbs<SN extends SectionName>(
  sectionName: SN
): UpdateSectionVarbs<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((relVarbs, varbName) => {
    const baseVarb = getBaseVarb(
      sectionName,
      varbName
    ) as any as GeneralBaseVarb;
    const { valueUnit } = baseVarb;
    const valueName = sectionVarbValueName(sectionName, varbName);
    relVarbs[varbName] = updateVarb(valueName, {
      calculateRound: calculatedRounding[valueUnit],
    });
    return relVarbs;
  }, {} as UpdateSectionVarbs<SN>);
}
