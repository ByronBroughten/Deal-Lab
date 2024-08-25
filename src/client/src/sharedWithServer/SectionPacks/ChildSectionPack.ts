import { validateSectionPackArrByType } from "../SectionNameByType";
import {
  ChildName,
  validateChildName,
} from "../stateSchemas/derivedFromChildrenSchemas/ChildName";
import {
  ChildSectionName,
  childToSectionName,
} from "../stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import { SectionName } from "../stateSchemas/SectionName";
import { Obj } from "../utils/Obj";
import { SectionPack } from "./SectionPack";

export type ChildSectionPack<
  SN extends SectionName,
  CN extends ChildName<SN>
> = SectionPack<ChildSectionName<SN, CN>>;

export type ChildArrPack<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPacks: SectionPack<CT>[];
};

export type ChildPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  [C in CN]: ChildSectionPack<SN, C>[];
};

export function validateSectionPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
>(
  value: any,
  sectionName: SN,
  validNames?: readonly CN[]
): ChildPackArrs<SN, CN> {
  const packArrs = Obj.validateObjToAny(value);
  for (const key of Obj.keys(packArrs)) {
    const childName = validateChildName(sectionName, key, validNames);
    const childSn = childToSectionName(sectionName, childName);
    validateSectionPackArrByType({
      value: packArrs[childName],
      sectionType: childSn,
    });
  }
  return value;
}

export type ChildPackInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPack: SectionPack<CT>;
};
