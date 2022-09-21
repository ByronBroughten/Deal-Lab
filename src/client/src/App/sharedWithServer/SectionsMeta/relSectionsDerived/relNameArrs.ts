import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { allSectionTraits } from "../allSectionTraits";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { hasChildSectionNames } from "../childSectionsDerived/ChildName";
import { hasStoreNameArrs } from "./relNameArrs/feStoreNameArrs";
import { tableStoreNameArrs } from "./relNameArrs/tableStoreArrs";

export const relNameArrs = {
  ...hasStoreNameArrs,
  ...tableStoreNameArrs,
  hasGlobalVarbs: Obj.entryKeysWithPropValue(
    allSectionTraits,
    "hasGlobalVarbs",
    true as true
  ),
  hasChild: hasChildSectionNames,
  loadOnLogin: Arr.extractStrict(simpleSectionNames, ["feUser"] as const),
  varbListItem: Arr.extractStrict(simpleSectionNames, [
    "outputItem",
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
