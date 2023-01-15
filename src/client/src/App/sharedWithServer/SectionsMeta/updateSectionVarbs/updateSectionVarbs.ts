import {
  getBaseVarb,
  sectionVarbNames,
  sectionVarbValueName,
  VarbName,
  VarbValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { GeneralBaseVarb } from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import {
  calculatedRounding,
  GeneralUpdateVarb,
  UpdateVarb,
  updateVarb,
} from "./updateVarb";

export type GeneralUpdateSectionVarbs = Record<string, GeneralUpdateVarb>;

export type UpdateSectionVarbs<SN extends SectionName> = {
  [VN in VarbName<SN>]: UpdateVarb<VarbValueName<SN, VN>>;
};
function checkUpdateSectionVarbs<
  SN extends SectionName,
  UVS extends UpdateSectionVarbs<SN>
>(value: UVS): UVS {
  return value;
}

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
    const baseVarb = getBaseVarb(
      sectionName,
      varbName
    ) as any as GeneralBaseVarb;
    const { valueUnit } = baseVarb;
    const valueName = sectionVarbValueName(sectionName, varbName);
    updateVarbs[varbName] = updateVarb(valueName, {
      calculateRound: calculatedRounding[valueUnit],
    });
    return updateVarbs;
  }, {} as UpdateSectionVarbs<SN>);
}
