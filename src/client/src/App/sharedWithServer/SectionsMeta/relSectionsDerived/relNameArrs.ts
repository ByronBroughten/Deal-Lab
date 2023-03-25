import { Arr } from "../../utils/Arr";
import { hasChildSectionNames } from "../sectionChildrenDerived/ChildName";
import { SectionName, sectionNames } from "../SectionName";
import { indexStoreSectionNames, storeSectionNames } from "../sectionStores";

export const relNameArrs = {
  hasIndexStore: indexStoreSectionNames,
  hasStore: storeSectionNames,
  hasChild: hasChildSectionNames,
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
