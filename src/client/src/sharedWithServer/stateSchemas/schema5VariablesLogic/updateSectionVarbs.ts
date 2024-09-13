import { StrictOmit } from "../../utils/types";
import {
  sectionVarbNames,
  VarbName,
} from "../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import {
  sectionVarbValueName,
  VarbValueName,
} from "../fromSchema3SectionStructures/baseSectionValues";
import { SectionName } from "../schema2SectionNames";
import { GeneralUpdateVarb, UpdateVarb, updateVarb, uvS } from "./updateVarb";

export type GeneralUpdateSectionVarbs = Record<string, GeneralUpdateVarb>;

export type UpdateSectionVarbs<SN extends SectionName> = {
  [VN in VarbName<SN>]: UpdateVarb<VarbValueName<SN, VN>>;
};
export type USVS<SN extends SectionName> = UpdateSectionVarbs<SN>;

function checkUpdateSectionVarbs<
  SN extends SectionName,
  UVS extends UpdateSectionVarbs<SN>
>(value: UVS): UVS {
  return value;
}

function updateSectionVarbs<SN extends SectionName>(
  _sectionName: SN,
  value: StrictOmit<UpdateSectionVarbs<SN>, "_typeUniformity">
): UpdateSectionVarbs<SN> {
  return {
    ...value,
    _typeUniformity: uvS.basic("string", "manualUpdateOnly"),
  } as UpdateSectionVarbs<SN>;
}

export const usvs = updateSectionVarbs;

type Options<SN extends SectionName> = Partial<UpdateSectionVarbs<SN>>;

export function updateSectionProp<
  SN extends SectionName,
  O extends Options<SN> = {}
>(sectionName: SN, options?: O): { [S in SN]: UpdateSectionVarbs<SN> } {
  return {
    [sectionName]: checkUpdateSectionVarbs({
      ...defaultSectionUpdateVarbs(sectionName),
      ...options,
    }),
  } as any;
}

export function defaultSectionUpdateVarbs<SN extends SectionName>(
  sectionName: SN
): UpdateSectionVarbs<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((updateVarbs, varbName) => {
    const valueName = sectionVarbValueName(sectionName, varbName);
    updateVarbs[varbName] = updateVarb(valueName);
    return updateVarbs;
  }, {} as UpdateSectionVarbs<SN>);
}
