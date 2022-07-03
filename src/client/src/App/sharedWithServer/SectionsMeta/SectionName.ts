import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { PropKeyOfValue } from "../utils/Obj/SubType";
import { SimpleSectionName } from "./baseSections";
import { baseNameArrs, BaseNameArrs } from "./baseSectionsDerived/baseNameArrs";
import { ChildName } from "./childSectionsDerived/ChildName";
import { ChildToSectionName } from "./childSectionsDerived/ChildSectionName";
import { ParentName } from "./childSectionsDerived/ParentName";
import { relNameArrs, RelNameArrs } from "./relSectionsDerived/relNameArrs";

type NameArrs = BaseNameArrs["fe"] & RelNameArrs;
function makeNameArrs(): NameArrs {
  return {
    ...baseNameArrs["fe"],
    ...relNameArrs,
  };
}

export type SectionNameType = keyof NameArrs;

export type SectionName<T extends SectionNameType = "all"> =
  NameArrs[T][number & keyof NameArrs[T]];

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

function _testChildNameOfType<
  SN extends "property" | "mgmt",
  CN extends ChildNameOfType<SN, "additiveList">
>(sn: SN, cn: CN) {}
_testChildNameOfType("property", "ongoingCostList");
