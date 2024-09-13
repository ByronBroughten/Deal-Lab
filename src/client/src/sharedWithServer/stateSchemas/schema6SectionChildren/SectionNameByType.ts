import { StringTypeChecker } from "../../../modules/utils/StringTypeChecker";
import {
  isSectionPack,
  SectionPack,
  validateSectionPack,
} from "../../StateTransports/SectionPack";
import { Arr } from "../../utils/Arr";
import { PropKeyOfValue } from "../../utils/Obj/SubType";
import {
  BaseNameArrs,
  baseNameArrs,
} from "../fromSchema3SectionStructures/baseNameArrs";
import {
  ChildName,
  getChildNames,
} from "../fromSchema6SectionChildren/ChildName";
import {
  ChildToSectionName,
  childToSectionName,
} from "../fromSchema6SectionChildren/ChildSectionName";
import {
  childTypeArrs,
  ChildTypeArrs,
} from "../fromSchema6SectionChildren/childTypeArrs";
import { ParentName } from "../fromSchema6SectionChildren/ParentName";
import { SectionName } from "../schema2SectionNames";
import { SectionValues } from "../schema4ValueTraits/StateValue";

type NameArrs = BaseNameArrs & ChildTypeArrs;
function makeNameArrs(): NameArrs {
  return {
    ...baseNameArrs,
    ...childTypeArrs,
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

function validateSectionPackByType<ST extends SectionNameType = "all">(
  value: any,
  sectionType?: ST
): SectionPackByType<ST> {
  validateSectionPack(value);
  sectionNameS.validate(value.sectionName, sectionType);
  return value;
}
