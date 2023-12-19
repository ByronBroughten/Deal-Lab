import { indexStoreSectionNames, storeSectionNames } from "../../sectionStores";
import { SectionName } from "../../sectionVarbsConfig/SectionName";
import { hasChildSectionNames } from "../sectionChildrenDerived/ChildName";

export const relNameArrs = {
  hasIndexStore: indexStoreSectionNames,
  hasStore: storeSectionNames,
  hasChild: hasChildSectionNames,
} as const;

export type RelNameArrs = typeof relNameArrs;
type RelNameSelector = keyof RelNameArrs;

type RelNameArrsTest<T extends Record<string, readonly SectionName[]>> = T;
type _Test = RelNameArrsTest<RelNameArrs>;

export type RelName<ST extends RelNameSelector> = RelNameArrs[ST][number];
