import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { simpleSectionNames } from "../baseSections";
import { HasChildSectionName } from "../childSectionsDerived/ChildTypes";
import { relSections } from "../relSections";
import { hasStoreNameArrs, storeNameArrs } from "./relNameArrs/storeArrs";
import { tableStoreNameArrs } from "./relNameArrs/tableStoreArrs";

export const relNameArrs = {
  ...hasStoreNameArrs,
  ...storeNameArrs,

  hasChild: simpleSectionNames.filter((sectionName) => {
    return Obj.keys(relSections[sectionName].children).length > 0;
  }) as HasChildSectionName[],
  ...tableStoreNameArrs,
  varbListItem: Arr.extractStrict(simpleSectionNames, [
    "singleTimeItem",
    "ongoingItem",
    "userVarbItem",
  ] as const),
} as const;

export type RelNameArrs = typeof relNameArrs;
type RelNameSelector = keyof RelNameArrs;

export type RelName<ST extends RelNameSelector> = RelNameArrs[ST][number];
