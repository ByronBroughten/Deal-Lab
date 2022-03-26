import { Obj, ObjectKeys, ObjectValues } from "../../utils/Obj";
import { SubType } from "../../utils/typescript";
import { RelSections, relSections } from "./relSections";
import { BaseName, isBaseName } from "./relSections/baseSectionTypes";
import Arr from "../../utils/Arr";
import { baseNameArrs } from "./relSections/baseSectionTypes/baseNameArrs";
import { SectionContext } from "./relSections/baseSections";
import { GeneralRelSection } from "./relSections/rel/relSection";
import {
  HasOneParentSectionName,
  HasParentSectionName,
  IsSingleParentName,
  makeSectionToParentArrs,
} from "./relSectionTypes/ParentTypes";
import { HasChildSectionName } from "./relSectionTypes/ChildTypes";
import {
  UserItemSectionName,
  userListItemTypes,
} from "./relSectionTypes/UserListTypes";

// this is here so that there isn't spaghetti code between relSectionTypes
// and StoreTypes
export type HasRowIndexStoreName = keyof SubType<
  RelSections,
  { indexStoreName: BaseName<"rowIndex"> }
>;

export type ListSectionName = BaseName<"allList">;
function makerelNameArrs<SC extends SectionContext>(sectionContext: SC) {
  const sectionToParentArrs = makeSectionToParentArrs(sectionContext);
  const savableSectionNames = Arr.extract(
    baseNameArrs.db.dbStore,
    baseNameArrs.fe.all
  );
  return {
    savable: savableSectionNames,
    hasIndexStore: Obj.entryKeysWithProp(
      relSections[sectionContext],
      "indexStoreName"
    ),
    hasDefaultStore: Obj.entryKeysWithProp(
      relSections[sectionContext],
      "defaultStoreName"
    ),
    savableAlwaysOne: Arr.extract(
      savableSectionNames,
      baseNameArrs[sectionContext].alwaysOne
    ),
    get hasRowIndexStore() {
      return this.hasIndexStore.filter((sectionName) => {
        const { indexStoreName } = relSections[sectionContext][
          sectionName
        ] as any;
        return isBaseName(indexStoreName, "rowIndex");
      }) as HasRowIndexStoreName[];
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
      return sectionToParentArrs[sectionName].length > 0;
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
      return Arr.extract(savableSectionNames, this.hasOneParent);
    },
    get isSingleParent() {
      return this.hasOneParent.reduce((names, name) => {
        const singleParentNameArr = sectionToParentArrs[name];
        if (!names.includes(singleParentNameArr[0] as any))
          names.push(...(singleParentNameArr as any));
        return names;
      }, [] as IsSingleParentName<SC>[]);
    },
    userListItem: Obj.values(userListItemTypes) as UserItemSectionName[],
  } as const;
}

export const relNameArrs = {
  fe: {
    ...baseNameArrs.fe,
    ...makerelNameArrs("fe"),
  },
  db: {
    ...baseNameArrs.db,
    ...makerelNameArrs("db"),
  },
} as const;
export type RelNameArrs = typeof relNameArrs;
