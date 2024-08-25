import { Id } from "../Ids/IdS";
import { RawSections, validateRawSections } from "../State/RawSection";
import { SectionName, validateSectionName } from "../stateSchemas/SectionName";
import { ValidationError } from "../utils/Error";
import { Obj } from "../utils/Obj";

export type SectionPack<SN extends SectionName = SectionName> = {
  dbId: string;
  sectionName: SN;
  rawSections: RawSections;
};

export type SectionArrPack<SN extends SectionName> = {
  sectionName: SN;
  sectionPacks: SectionPack<SN>[];
};

export function validateSectionPack<SN extends SectionName = any>(
  value: any,
  sectionName?: SN
): SectionPack<SN> {
  const obj = Obj.validateObjToAny(value) as SectionPack<SN>;

  if (sectionName) {
    if (obj.sectionName !== sectionName) {
      throw new ValidationError(
        `sectionPack sectionName of "${obj.sectionName}" does not match passed sectionName of ${sectionName}`
      );
    }
  }

  return {
    sectionName: validateSectionName(obj.sectionName) as SN,
    dbId: Id.validate(obj.dbId),
    rawSections: validateRawSections(obj.rawSections),
  };
}

export function isSectionPack(value: any): value is SectionPack {
  try {
    validateSectionPack(value);
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      return false;
    } else {
      throw error;
    }
  }
}
