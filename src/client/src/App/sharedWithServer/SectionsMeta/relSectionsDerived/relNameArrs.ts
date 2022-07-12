import { Arr } from "../../utils/Arr";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { hasChildSectionNames } from "../childSectionsDerived/ChildName";
import { dbSectionNameGroups } from "../childSectionsDerived/dbStoreNames";
import { hasStoreNameArrs } from "./relNameArrs/dbStoreNameArrs";
import { tableStoreNameArrs } from "./relNameArrs/tableStoreArrs";

export const relNameArrs = {
  ...hasStoreNameArrs,
  ...tableStoreNameArrs,
  ...dbSectionNameGroups,
  hasChild: hasChildSectionNames,
  varbListItem: Arr.extractStrict(simpleSectionNames, [
    "singleTimeItem",
    "ongoingItem",
    "userVarbItem",
  ] as const),
} as const;

export type RelNameArrs = typeof relNameArrs;
type RelNameSelector = keyof RelNameArrs;

type RelNameArrsTest<T extends Record<string, readonly SimpleSectionName[]>> =
  T;
type _Test = RelNameArrsTest<RelNameArrs>;

export type RelName<ST extends RelNameSelector> = RelNameArrs[ST][number];
