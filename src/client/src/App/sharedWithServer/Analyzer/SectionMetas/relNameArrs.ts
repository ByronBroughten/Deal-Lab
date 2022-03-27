import { Obj, ObjectKeys } from "../../utils/Obj";
import { SubType } from "../../utils/typescript";
import { RelSections, relSections } from "./relSections";
import { BaseName, isBaseName } from "./relSections/baseSectionTypes";
import Arr from "../../utils/Arr";
import { baseNameArrs } from "./relSections/baseSectionTypes/baseNameArrs";
import { ContextName, SimpleSectionName } from "./relSections/baseSections";
import { GeneralRelSection } from "./relSections/rel/relSection";
import {
  HasOneParentSectionName,
  HasParentSectionName,
  IsSingleParentName,
  makeSectionToParentArrs,
} from "./relNameArrs/ParentTypes";
import { HasChildSectionName } from "./relNameArrs/ChildTypes";
import {
  UserItemSectionName,
  userListItemTypes,
} from "./relNameArrs/UserListTypes";

// this is here so that there isn't spaghetti code between relSectionTypes
// and StoreTypes
export type HasRowIndexStoreName<SC extends ContextName> = keyof SubType<
  RelSections[SC],
  { indexStoreName: BaseName<"rowIndex"> }
>;

export type ListSectionName = BaseName<"allList">;
function makeRelNameArrs<SC extends ContextName>(sectionContext: SC) {
  const sectionToParentArrs = makeSectionToParentArrs()[sectionContext];
  const savableSectionNames = Arr.extract(
    baseNameArrs.db.dbStore,
    baseNameArrs.fe.all
  );

  return {
    savable: savableSectionNames,
    hasIndexStore: Obj.entryKeysWithPropOfType(
      relSections[sectionContext],
      "indexStoreName",
      "string"
    ),
    hasDefaultStore: Obj.entryKeysWithPropOfType(
      relSections[sectionContext],
      "defaultStoreName",
      "string"
    ),
    savableAlwaysOne: Arr.extract(
      savableSectionNames,
      baseNameArrs[sectionContext].alwaysOne
    ),
    get hasRowIndexStore() {
      return this.hasIndexStore.filter((sectionName) => {
        const { indexStoreName } = relSections[sectionContext][
          sectionName
        ] as any as GeneralRelSection;
        return isBaseName(indexStoreName, "rowIndex");
      }) as string[] as HasRowIndexStoreName<SC>[];
    },
    get hasFullIndexStore() {
      return Arr.exclude(this.hasIndexStore, this.hasRowIndexStore);
    },
    hasChild: ObjectKeys(relSections[sectionContext]).filter((sectionName) => {
      return (
        (relSections[sectionContext][sectionName] as any as GeneralRelSection)
          .childSectionNames.length > 0
      );
    }) as HasChildSectionName<SC>[],
    hasParent: ObjectKeys(sectionToParentArrs).filter((sectionName) => {
      return (sectionToParentArrs[sectionName] as any as string[]).length > 0;
    }) as HasParentSectionName<SC>[],
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
    ...makeRelNameArrs("fe"),
  },
  db: {
    ...makeRelNameArrs("db"),
  },
} as const;
export type RelNameArrs = typeof relNameArrs;
