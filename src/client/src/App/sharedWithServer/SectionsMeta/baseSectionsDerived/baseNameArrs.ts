import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import {
  BaseSections,
  baseSections,
  ContextName,
  sectionContext,
  SimpleSectionName,
  simpleSectionNames,
} from "../baseSections";
import { GeneralBaseSection } from "../baseSectionsUtils/baseSection";
import {
  dbStoreNames,
  feGuestAccessNames,
  loadOnLoginNames,
} from "../childSectionsDerived/dbStoreNames";

const baseSectionVarbs = Obj.toNestedPropertyObj(
  baseSections.fe,
  "varbSchemas"
);
export type BaseSectionVarbs = typeof baseSectionVarbs;

type HasVarbSectionName<
  NoVarbSectionName = keyof SubType<
    BaseSections["fe"],
    { varbSchemas: { [K in any]: never } }
  >
> = Exclude<keyof BaseSections["fe"], NoVarbSectionName>;

function makeSingleSectionNameArrs<
  SC extends ContextName,
  SnArrs = {
    [Prop in keyof BaseSections[SC]]: readonly Prop[];
  }
>(context: SC): SnArrs {
  return Obj.keys(baseSections[context]).reduce((snArrs, sectionName) => {
    snArrs[sectionName as keyof SnArrs] = [
      sectionName,
    ] as any as SnArrs[keyof SnArrs];
    return snArrs;
  }, {} as SnArrs);
}

function makeBaseNameArrsForContext<SC extends ContextName>(
  sectionContext: SC
) {
  const baseSectionsOfContext = baseSections[sectionContext];

  return {
    ...makeSingleSectionNameArrs(sectionContext),
    dbStoreNext: dbStoreNames,
    all: simpleSectionNames as SimpleSectionName[],
    notRootNorOmni: Arr.excludeStrict(simpleSectionNames, [
      "root",
      "omniParent",
    ] as const),

    // booleans
    loadOnLogin: loadOnLoginNames,
    feGuestAccess: feGuestAccessNames,
    uniqueDbId: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "uniqueDbId",
      true as true
    ),

    // varbShape
    // In some cases it might be safer to go by whether they have the same children
    // in which cases they would be derived at a higher level
    singleTimeListType: Obj.filterKeysForEntryShape(
      baseSectionVarbs,
      baseSectionVarbs.singleTimeList
    ),

    hasVarb: Obj.keys(baseSectionsOfContext).filter((sectionName) => {
      const varbNames = Object.keys(
        (baseSectionsOfContext[sectionName] as any as GeneralBaseSection)
          .varbSchemas
      );
      return varbNames.length > 0;
    }) as HasVarbSectionName[],
    hasGlobalVarbs: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "hasGlobalVarbs",
      true as true
    ),
    get additiveList() {
      return ["singleTimeList", "ongoingList"] as const;
    },
    get varbListAllowed() {
      return Arr.extractStrict(this.all, [
        "singleTimeList",
        "ongoingList",
        "userVarbList",
      ] as const);
    },
    // combo
  };
}

function makeBaseNameArrs() {
  return sectionContext.typeCheckContextObj({
    fe: makeBaseNameArrsForContext("fe"),
    db: makeBaseNameArrsForContext("db"),
  });
}

type GeneralBaseNameArrs = {
  fe: Record<string, readonly (keyof BaseSections["fe"])[]>;
  db: Record<string, readonly (keyof BaseSections["db"])[]>;
};

export const baseNameArrs = makeBaseNameArrs();

const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector = keyof BaseNameArrs["fe"];
