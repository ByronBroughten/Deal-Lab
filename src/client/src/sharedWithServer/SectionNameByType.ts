import { StringTypeChecker } from "../App/utils/StringTypeChecker";
import {
  SectionPack,
  isSectionPack,
  validateSectionPack,
} from "./SectionPacks/SectionPack";
import { SectionName } from "./sectionVarbsConfig/SectionName";
import { SectionValues } from "./sectionVarbsConfig/StateValue";
import {
  BaseNameArrs,
  baseNameArrs,
} from "./sectionVarbsConfigDerived/baseSectionsDerived/baseNameArrs";
import {
  RelNameArrs,
  relNameArrs,
} from "./sectionVarbsConfigDerived/relSectionsDerived/relNameArrs";
import {
  ChildName,
  getChildNames,
} from "./sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import {
  ChildToSectionName,
  childToSectionName,
} from "./sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";
import { ParentName } from "./sectionVarbsConfigDerived/sectionChildrenDerived/ParentName";
import { Arr } from "./utils/Arr";
import { PropKeyOfValue } from "./utils/Obj/SubType";

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
  CN extends ChildNameOfType<SN, "miscPeriodicValue">
>(sn: SN, cn: CN) {}
_testChildNameOfType("property", "miscOngoingCost");

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
): SectionPackByType<ST> {
  validateSectionPack(value);
  sectionNameS.validate(value.sectionName, sectionType);
  return value;
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
