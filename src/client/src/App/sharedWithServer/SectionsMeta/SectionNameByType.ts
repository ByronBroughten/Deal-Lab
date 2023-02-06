import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { SectionPackArrs } from "../StatePackers.ts/PackMakerSection";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { PropKeyOfValue } from "../utils/Obj/SubType";
import { baseNameArrs, BaseNameArrs } from "./baseSectionsDerived/baseNameArrs";
import { SectionValues } from "./baseSectionsDerived/valueMetaTypes";
import { relNameArrs, RelNameArrs } from "./relSectionsDerived/relNameArrs";
import {
  ChildName,
  getChildNames,
  validateChildName,
} from "./sectionChildrenDerived/ChildName";
import {
  childToSectionName,
  ChildToSectionName,
} from "./sectionChildrenDerived/ChildSectionName";
import { ParentName } from "./sectionChildrenDerived/ParentName";
import {
  isSectionPack,
  SectionPack,
  validateSectionPack,
} from "./sectionChildrenDerived/SectionPack";
import { SectionName } from "./SectionName";

type NameArrs = BaseNameArrs & RelNameArrs;
function makeNameArrs(): NameArrs {
  return {
    ...baseNameArrs,
    ...relNameArrs,
  };
}

export type SectionNameType = keyof NameArrs;

export type SectionNameByType<T extends SectionNameType = "all"> =
  NameArrs[T][number & keyof NameArrs[T]];

export type SectionValuesByType<ST extends SectionNameType> = SectionValues<
  SectionNameByType<ST>
>;

export const sectionNameS = new StringTypeChecker(makeNameArrs());

type GeneralNameArrs = Record<SectionNameType, readonly SectionName[]>;
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);

export type ParentOfTypeName<T extends SectionNameType = "all"> = ParentName<
  SectionNameByType<T>
>;

export type ChildNameOfType<
  SN extends SectionName,
  ST extends SectionNameType
> = PropKeyOfValue<
  ChildToSectionName[SN],
  ChildToSectionName[SN][keyof ChildToSectionName[SN]] & SectionNameByType<ST>
> &
  ChildName<SN>;

export function childNamesOfType<
  SN extends SectionName,
  ST extends SectionNameType
>(sectionName: SN, sectionType: ST): ChildNameOfType<SN, ST>[] {
  const cNamesOfType: ChildNameOfType<SN, ST>[] = [];
  const childNames = getChildNames(sectionName);
  for (const childName of childNames) {
    const childSn = childToSectionName(sectionName, childName);
    if (sectionNameS.is(childSn, sectionType)) {
      cNamesOfType.push(childName as ChildNameOfType<SN, ST>);
    }
  }
  return cNamesOfType;
}

function _testChildNameOfType<
  SN extends "property" | "mgmt",
  CN extends ChildNameOfType<SN, "ongoingValueGroup">
>(sn: SN, cn: CN) {}
_testChildNameOfType("property", "ongoingExpenseGroup");

export type SectionPackByType<ST extends SectionNameType> = SectionPack<
  SectionNameByType<ST>
>;
export function isSectionPackByType<ST extends SectionNameType = "all">(
  value: any,
  sectionType?: ST
): value is SectionPackByType<ST> {
  if (
    isSectionPack(value) &&
    sectionNameS.is(value.sectionName, sectionType ?? "all")
  ) {
    return true;
  } else return false;
}
export function validateSectionPackByType<ST extends SectionNameType = "all">(
  value: any,
  sectionType?: ST
): value is SectionPackByType<ST> {
  if (validateSectionPack(value)) {
    sectionNameS.validate(value.sectionName, sectionType);
  }
  return true;
}

type ValidateSectionPackArrProps = {
  value: any;
  sectionType: SectionNameType;
};
export function validateSectionPackArrByType<ST extends SectionNameType>({
  value,
  sectionType,
}: ValidateSectionPackArrProps): SectionPackByType<ST>[] {
  if (
    Arr.validateIsArray(value).every((v) =>
      validateSectionPackByType(v, sectionType)
    )
  ) {
    return value;
  } else {
    throw new Error("Payload is not a valid sectionPack array.");
  }
}

export function validateSectionPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
>(
  value: any,
  sectionName: SN,
  validNames?: readonly CN[]
): SectionPackArrs<SN, CN> {
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
