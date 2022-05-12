import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { ContextName, SimpleSectionName } from "./baseSections";
import { BaseName } from "./baseSectionTypes";
import { baseNameArrs } from "./baseSectionTypes/baseNameArrs";
import { hasStoreNameArrs, storeNameArrs } from "./relNameArrs/storeArrs";
import { tableIndexNames } from "./relNameArrs/tableSourceArrs";
import { relSections } from "./relSections";
import { GeneralRelSection } from "./relSections/rel/relSection";
import { HasChildSectionName } from "./relSectionTypes/ChildTypes";
import {
  HasOneParentSectionName,
  HasParentSectionName,
  IsSingleParentName,
  makeSectionToParentArrs,
} from "./relSectionTypes/ParentTypes";
import {
  UserItemSectionName,
  userListItemTypes,
} from "./relSectionTypes/UserListTypes";

export type ListSectionName = BaseName<"allList">;
function makeRelNameArrs<
  SC extends ContextName,
  AS extends { [key: string]: readonly any[] }
>(sectionContext: SC, arrs: AS) {
  const sectionToParentArrs = makeSectionToParentArrs()[sectionContext];
  const savableSectionNames = Arr.extract(
    baseNameArrs.db.dbStore,
    baseNameArrs.fe.all
  );

  return {
    ...arrs,
    savable: savableSectionNames,
    tableSource: tableIndexNames,
    hasDefaultStore: Obj.entryKeysWithPropOfType(
      relSections[sectionContext],
      "defaultStoreName",
      "string"
    ),
    savableAlwaysOne: Arr.extract(
      savableSectionNames,
      baseNameArrs[sectionContext].alwaysOne
    ),
    hasChild: Obj.keys(relSections[sectionContext]).filter((sectionName) => {
      return (
        (relSections[sectionContext][sectionName] as any as GeneralRelSection)
          .childNames.length > 0
      );
    }) as HasChildSectionName<SC>[],
    hasParent: Obj.keys(sectionToParentArrs).filter((sectionName) => {
      return (sectionToParentArrs[sectionName] as any as string[]).length > 0;
    }) as HasParentSectionName<SC>[],
    get alwaysOneHasParent() {
      return Arr.extract(
        this.hasParent,
        baseNameArrs[sectionContext].alwaysOne
      );
    },
    get hasOneParent() {
      return this.hasParent.filter((sectionName) => {
        return (
          sectionToParentArrs[sectionName].length === 1 &&
          baseNameArrs.fe.alwaysOne.includes(
            sectionToParentArrs[sectionName][0] as any
          )
        );
      }) as HasOneParentSectionName<SC>[];
    },
    get savableOneParent() {
      return Arr.extract(
        savableSectionNames,
        this.hasOneParent as any
      ) as Extract<
        typeof savableSectionNames[number],
        HasOneParentSectionName<SC>[number]
      >[];
    },
    get isSingleParent() {
      return (this.hasOneParent as SimpleSectionName[]).reduce(
        (names, name) => {
          const singleParentNameArr = sectionToParentArrs[name];
          if (!names.includes(singleParentNameArr[0] as any))
            names.push(...singleParentNameArr);
          return names;
        },
        [] as string[]
      ) as string[] as IsSingleParentName<SC>[];
    },
    userListItem: Obj.values(userListItemTypes) as UserItemSectionName[],
  } as const;
}

export const relNameArrs = {
  fe: {
    ...makeRelNameArrs("fe", { ...hasStoreNameArrs, ...storeNameArrs }),
  },
  db: {
    ...makeRelNameArrs("db", { ...hasStoreNameArrs, ...storeNameArrs }),
  },
} as const;
export type RelNameArrs = typeof relNameArrs;

type RelNameSelector<SC extends ContextName = "fe"> = keyof RelNameArrs[SC];

export type RelName<
  ST extends RelNameSelector<SC>,
  SC extends ContextName = "fe",
  NameArrs = RelNameArrs[SC][ST]
> = NameArrs[number & keyof NameArrs];
