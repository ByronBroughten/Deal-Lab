import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { PropKeyOfValue } from "../utils/Obj/SubType";
import { StrictExtract } from "../utils/types";
import { SimpleSectionName } from "./baseSections";
import { baseNameArrs, BaseNameArrs } from "./baseSectionsDerived/baseNameArrs";
import { ChildName, getChildNames } from "./childSectionsDerived/ChildName";
import {
  childToSectionName,
  ChildToSectionName,
} from "./childSectionsDerived/ChildSectionName";
import { ParentName } from "./childSectionsDerived/ParentName";
import { isSectionPack, SectionPack } from "./childSectionsDerived/SectionPack";
import { relNameArrs, RelNameArrs } from "./relSectionsDerived/relNameArrs";
import { SectionValues } from "./relSectionsUtils/valueMetaTypes";

type NameArrs = BaseNameArrs & RelNameArrs;
function makeNameArrs(): NameArrs {
  return {
    ...baseNameArrs,
    ...relNameArrs,
  };
}

export type SectionNameType = keyof NameArrs;

export type SectionName<T extends SectionNameType = "all"> =
  NameArrs[T][number & keyof NameArrs[T]];

export type HasRowFeStore = StrictExtract<
  SectionName<"hasRowIndex">,
  "property" | "loan" | "mgmt" | "deal"
>;
// HasRowFeStore counteracts a but that makes no sense to me.

export type SectionValuesByType<ST extends SectionNameType> = SectionValues<
  SectionName<ST>
>;

export const sectionNameS = new StringTypeChecker(makeNameArrs());

type GeneralNameArrs = Record<SectionNameType, readonly SimpleSectionName[]>;
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);

export type ParentOfTypeName<T extends SectionNameType = "all"> = ParentName<
  SectionName<T>
>;

export type ChildNameOfType<
  SN extends SimpleSectionName,
  ST extends SectionNameType
> = PropKeyOfValue<
  ChildToSectionName[SN],
  ChildToSectionName[SN][keyof ChildToSectionName[SN]] & SectionName<ST>
> &
  ChildName<SN>;

export function childNamesOfType<
  SN extends SimpleSectionName,
  ST extends SectionNameType
>(sectionName: SN, sectionType: ST): ChildNameOfType<SN, ST>[] {
  const childNamesOfType: ChildNameOfType<SN, ST>[] = [];
  const childNames = getChildNames(sectionName);
  for (const childName of childNames) {
    const childSn = childToSectionName(sectionName, childName);
    if (sectionNameS.is(childSn, sectionType)) {
      childNamesOfType.push(childSn as ChildNameOfType<SN, ST>);
    }
  }
  return childNamesOfType;
}

function _testChildNameOfType<
  SN extends "property" | "mgmt",
  CN extends ChildNameOfType<SN, "additiveList">
>(sn: SN, cn: CN) {}
_testChildNameOfType("property", "ongoingCostList");

export type SectionPackByType<ST extends SectionNameType> = SectionPack<
  SectionName<ST>
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
