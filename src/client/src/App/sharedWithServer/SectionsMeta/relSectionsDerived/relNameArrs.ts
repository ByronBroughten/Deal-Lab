import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { hasChildSectionNames } from "../sectionChildrenDerived/ChildName";
import { SectionName, sectionNames } from "../SectionName";
import { allSectionTraits } from "../sectionsTraits";
import { hasStoreNameArrs } from "./FeStoreName";
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
  loadOnLogin: Arr.extractStrict(sectionNames, ["feUser"] as const),
  varbListItem: Arr.extractStrict(sectionNames, [
    "outputItem",
    "singleTimeItem",
    "ongoingItem",
    "userVarbItem",
  ] as const),
  valueSection: Arr.extractStrict(sectionNames, [
    "singleTimeValue",
    "ongoingValue",
  ] as const),
} as const;

export type RelNameArrs = typeof relNameArrs;
type RelNameSelector = keyof RelNameArrs;

type RelNameArrsTest<T extends Record<string, readonly SectionName[]>> = T;
type _Test = RelNameArrsTest<RelNameArrs>;

export type RelName<ST extends RelNameSelector> = RelNameArrs[ST][number];
