import { Arr } from "../../utils/Arr";
import { hasChildSectionNames } from "../sectionChildrenDerived/ChildName";
import { SectionName, sectionNames } from "../SectionName";
import { hasStoreNameArrs } from "./FeStoreName";
import { tableStoreNameArrs } from "./relNameArrs/tableStoreArrs";

export const relNameArrs = {
  ...hasStoreNameArrs,
  ...tableStoreNameArrs,
  hasChild: hasChildSectionNames,
  loadOnLogin: Arr.extractStrict(sectionNames, ["feUser"] as const),
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
