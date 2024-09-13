import { SectionName } from "../schema2SectionNames";
import {
  indexStoreSectionNames,
  storeSectionNames,
} from "../schema6SectionChildren/sectionStores";
import { hasChildSectionNames } from "./ChildName";

export const childTypeArrs = {
  hasIndexStore: indexStoreSectionNames,
  hasStore: storeSectionNames,
  hasChild: hasChildSectionNames,
} as const;

export type ChildTypeArrs = typeof childTypeArrs;
type RelNameSelector = keyof ChildTypeArrs;

type RelNameArrsTest<T extends Record<string, readonly SectionName[]>> = T;
type _Test = RelNameArrsTest<ChildTypeArrs>;

export type RelName<ST extends RelNameSelector> = ChildTypeArrs[ST][number];
