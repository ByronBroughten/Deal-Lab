import {
  BaseSections,
  baseSections,
  sectionContext,
  SectionContext,
  SimpleSectionName,
} from "../baseSections";
import Arr from "../../../../utils/Arr";
import { switchName, SwitchName } from "../baseSections/baseSwitchNames";
import { Obj } from "../../../../utils/Obj";
import { NeversToNull, SubType } from "../../../../utils/typescript";
import { ToArrObj } from "../../../../utils/types/objectTypes";
import { base } from "../baseSections/base";
import { GeneralBaseSection } from "../baseSections/baseSection";

type HasVarbSectionName<
  NoVarbSectionName = keyof SubType<
    BaseSections["fe"],
    { varbSchemas: { [K in any]: never } }
  >
> = Exclude<keyof BaseSections["fe"], NoVarbSectionName>;

const feBaseSectionVarbs = Obj.toNestedPropertyObj(
  baseSections.fe,
  "varbSchemas"
);
export type FeBaseSectionVarbs = typeof feBaseSectionVarbs;
type SectionSwitchName<
  SN extends SimpleSectionName,
  SVS = FeBaseSectionVarbs[SN]
> = SVS[keyof SVS]["switchName" & keyof SVS[keyof SVS]];

type SectionSwitchNames<SW extends SwitchName = SwitchName> = NeversToNull<{
  [Prop in SimpleSectionName]: Extract<SectionSwitchName<Prop>, SW>;
}>;

type SwitchBaseName<SW extends SwitchName = SwitchName> = keyof SubType<
  SectionSwitchNames<SW>,
  SW
>;

type SwitchSectionNames = {
  [SW in SwitchName]: SwitchBaseName<SW>;
};

type BaseNameSwitchArrs = ToArrObj<SectionSwitchNames>;
function makeBaseNameSwitchArrs(feBaseSectionVarbs: FeBaseSectionVarbs) {
  return Obj.keys(feBaseSectionVarbs).reduce(
    (sectionSwitchNameArrs, sectionName) => {
      const switchNameSet: Set<SwitchName | null> = new Set();

      const sectionVarbs = feBaseSectionVarbs[sectionName];

      type Test = typeof sectionVarbs;
      for (const varbName of Obj.keys(sectionVarbs)) {
        // For type safety, I would need a general version of FeBaseSectionVarbs.
        const varbs = sectionVarbs[varbName] as any;
        switchNameSet.add(varbs.switchName);
      }

      sectionSwitchNameArrs[sectionName] = [...switchNameSet];
    },
    {} as any
  ) as BaseNameSwitchArrs;
}

type SwitchSectionNameArrs = ToArrObj<SwitchSectionNames>;
function finalizeSwitchSectionNameArrs(baseNameSwitchArrs: BaseNameSwitchArrs) {
  return switchName.nameArr.reduce((switchSectionNameArrs, switchName) => {
    const sectionNames: any[] = [];

    for (const sectionName of Obj.keys(baseNameSwitchArrs)) {
      if ((baseNameSwitchArrs[sectionName] as any[]).includes(switchName)) {
        sectionNames.push(sectionName as any);
      }
    }

    switchSectionNameArrs[switchName] = sectionNames;
  }, {} as any) as SwitchSectionNameArrs;
}
function makeSwitchSectionNameArrs(
  feBaseSectionVarbs: FeBaseSectionVarbs
): SwitchSectionNameArrs {
  const baseNameSwitchArrs = makeBaseNameSwitchArrs(feBaseSectionVarbs);
  return finalizeSwitchSectionNameArrs(baseNameSwitchArrs);
}

export const depreciatingDbStoreNames = [
  "user",
  "userProtected",
  "propertyIndex",
  "property",
  "propertyDefault",
  "propertyTable",
  "loan",
  "loanIndex",
  "loanDefault",
  "loanTable",
  "mgmt",
  "mgmtIndex",
  "mgmtDefault",
  "mgmtTable",
  "analysis",
  "analysisIndex",
  "analysisDefault",
  "analysisTable",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

function makeSingleSectionNameArrs<
  SC extends SectionContext,
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

function makeBaseNameArrsForContext<SC extends SectionContext>(
  sectionContext: SC
) {
  const baseSectionsOfContext = baseSections[sectionContext];

  return {
    ...makeSingleSectionNameArrs(sectionContext),
    dbStore: depreciatingDbStoreNames,

    all: Obj.keys(baseSectionsOfContext) as SimpleSectionName<SC>[],

    // booleans
    initOnLogin: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "loadOnLogin",
      true as true
    ),
    feGuestAccessStore: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "feGuestAccess",
      true as true
    ),
    alwaysOne: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "alwaysOne",
      true as true
    ),
    userDefined: Obj.entryKeysWithPropValue(
      baseSectionsOfContext,
      "userDefined",
      true as true
    ),
    protected: Obj.entryKeysWithPropValue(
      baseSections.fe,
      "protected",
      true as true
    ),

    // sectionShape
    // filtering by shape may often be better to do by children and varbNames
    // rather than just varbName, so probably best at a higher level
    rowIndex: Obj.filterKeysForEntryShape(
      baseSectionsOfContext,
      base.section.rowIndex
    ),
    table: Obj.filterKeysForEntryShape(
      baseSectionsOfContext,
      base.section.table
    ),

    // varbShape
    // In some cases it might be safer to go by whether they have the same children
    // in which cases they would be derived at a higher level
    singleTimeList: Obj.filterKeysForEntryShape(
      feBaseSectionVarbs,
      feBaseSectionVarbs.userSingleList
    ),
    ongoingList: Obj.filterKeysForEntryShape(
      feBaseSectionVarbs,
      feBaseSectionVarbs.userOngoingList
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

    // extracted
    get userList() {
      return Arr.extract(this.all, [
        "userSingleList",
        "userOngoingList",
        "userVarbList",
      ] as const);
    },
    get additiveList() {
      return Arr.extract(this.userList, [
        "userSingleList",
        "userOngoingList",
      ] as const);
    },
    get notAlwaysOne() {
      return Arr.exclude(this.all, this.alwaysOne);
    },
    get alwaysOneHasVarb() {
      return Arr.extract(this.hasVarb, this.alwaysOne);
    },
    // combo
    get allList() {
      return [
        ...this.singleTimeList,
        ...this.ongoingList,
        "userVarbList",
      ] as const;
    },

    // alias
    get feSaved() {
      return this.userList;
    },
  };
}
class BaseNameArrsForContext<SC extends SectionContext> {
  call(sectionContext: SC) {
    return makeBaseNameArrsForContext<SC>(sectionContext);
  }
}
type NextBaseNameArrs = {
  [SC in SectionContext]: ReturnType<BaseNameArrsForContext<SC>["call"]>;
};

function makeBaseNameArrs(): NextBaseNameArrs {
  const partial = sectionContext.makeBlankContextObj();
  for (const contextName of sectionContext.names) {
    const nameArrs: NextBaseNameArrs[typeof contextName] =
      makeBaseNameArrsForContext(contextName);
    partial[contextName] = nameArrs;
  }
  return partial;
}

type GeneralBaseNameArrs = {
  fe: Record<string, readonly (keyof BaseSections["fe"])[]>;
  db: Record<string, readonly (keyof BaseSections["db"])[]>;
};

export const baseNameArrs = makeBaseNameArrs();

const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector<SC extends SectionContext = "fe"> =
  keyof BaseNameArrs[SC];

// export const baseNames = {
//   all: allSectionNames,
//   table: tableSectionNames,
//   feGuestAccessStore: feGuestAccessStoreNames,
//   dbStore: dbStoreNames,
//   alwaysOne: alwaysOneSectionNames,
//   notAlwaysOne: notAlwaysOneSectionNames,
//   initOnLogin: initOnLoginSectionNames,
//   hasVarb: hasVarbSectionNames,
//   alwaysOneHasVarb: alwaysOneHasVarbNames,
//   userList: userListSectionNames,
//   feSaved: userListSectionNames,
//   singleTimeList: singleTimeListNames,
//   ongoingList: ongoingListNames,
//   allList: allListSectionNames,
//   additiveListType: additiveListSectionTypes,
//   rowIndex: rowIndexSectionNames,
//   hasGlobalVarbs: hasGlobalVarbNames,
//   userDefined: userDefinedSectionNames,
// } as const;
