import { Arr } from "../../utils/Arr";
import { simpleSectionNames } from "../baseSections";
import { hasChildSectionNames } from "../childSectionsDerived/ChildName";
import { hasStoreNameArrs, storeNameArrs } from "./relNameArrs/storeArrs";
import { tableStoreNameArrs } from "./relNameArrs/tableStoreArrs";

export const relNameArrs = {
  ...hasStoreNameArrs,
  ...storeNameArrs,
  ...tableStoreNameArrs,
  hasChild: hasChildSectionNames,
  varbListItem: Arr.extractStrict(simpleSectionNames, [
    "singleTimeItem",
    "ongoingItem",
    "userVarbItem",
  ] as const),
} as const;

export type RelNameArrs = typeof relNameArrs;
type RelNameSelector = keyof RelNameArrs;

export type RelName<ST extends RelNameSelector> = RelNameArrs[ST][number];
