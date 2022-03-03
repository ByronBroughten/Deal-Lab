import { Obj } from "../../../utils/Obj";
import { NeversToNull, SubType, ToArrObj } from "../../../utils/types";
import {
  BaseSections,
  baseSections,
  SectionContext,
  SimpleSectionName,
} from "./baseSections";
import { base } from "./baseSections/base";
import Arr from "../../../utils/Arr";
import { baseSwitch, SwitchName } from "./baseSections/baseSwitch";
import { pipe } from "../../../utils/pipe";

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
function baseNameSwitchArrs(feBaseSectionVarbs: FeBaseSectionVarbs) {
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
function switchSectionNameArrs(baseNameSwitchArrs: BaseNameSwitchArrs) {
  return baseSwitch.nameArr.reduce((switchSectionNameArrs, switchName) => {
    const sectionNames: any[] = [];

    for (const sectionName of Obj.keys(baseNameSwitchArrs)) {
      if ((baseNameSwitchArrs[sectionName] as any[]).includes(switchName)) {
        sectionNames.push(sectionName as any);
      }
    }

    switchSectionNameArrs[switchName] = sectionNames;
  }, {} as any) as SwitchSectionNameArrs;
}
function switchSectionNameArrPipe(
  feBaseSectionVarbs: FeBaseSectionVarbs
): SwitchSectionNameArrs {
  const fn = pipe<FeBaseSectionVarbs>()
    .then(baseNameSwitchArrs)
    .then(switchSectionNameArrs);
  return fn(feBaseSectionVarbs);
}

const sharedBaseNames = {
  // for now, this assumes that dbSectionNames is a superset of feSectionNames
  shared: Obj.keys(baseSections.fe),

  // boolean, assumes that these aren't changed between fe and db
  initOnLogin: Obj.entryKeysWithPropValue(
    baseSections.fe,
    "loadOnLogin",
    true as true
  ),
  feGuestAccessStore: Obj.entryKeysWithPropValue(
    baseSections.fe,
    "feGuestAccess",
    true as true
  ),
  alwaysOne: Obj.entryKeysWithPropValue(
    baseSections.fe,
    "alwaysOne",
    true as true
  ),

  get feSaved() {
    return this.userList;
  },

  get notAlwaysOne() {
    return Arr.exclude(this.shared, this.alwaysOne);
  },

  // sectionShape
  rowIndex: Obj.filterKeysForEntryShape(baseSections.fe, base.section.rowIndex),
  table: Obj.filterKeysForEntryShape(baseSections.fe, base.section.table),

  // varbShape
  // In some cases it might be safer to go by whether they have the same children
  // in which cases they would be derived from relSections
  singleTimeList: Obj.filterKeysForEntryShape(
    feBaseSectionVarbs,
    feBaseSectionVarbs.userSingleList
  ),
  ongoingList: Obj.filterKeysForEntryShape(
    feBaseSectionVarbs,
    feBaseSectionVarbs.userOngoingList
  ),
  hasVarb: Obj.keys(baseSections.fe).filter((sectionName) => {
    const varbNames = Object.keys(baseSections.fe[sectionName].varbSchemas);
    return varbNames.length > 0;
  }) as HasVarbSectionName[],
  hasGlobalVarbs: Obj.entryKeysWithPropValue(
    baseSections.fe,
    "hasGlobalVarbs",
    true as true
  ),

  // extracted
  get userList() {
    return Arr.extract(this.shared, [
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

  // misc
  ...switchSectionNameArrPipe(feBaseSectionVarbs),
} as const;

type GeneralBaseNameArrs = {
  fe: Record<string, readonly (keyof BaseSections["fe"])[]>;
  db: Record<string, readonly (keyof BaseSections["db"])[]>;
};

function snArrs<
  C extends SectionContext,
  SnArrs = {
    [Prop in keyof BaseSections[C]]: readonly Prop[];
  }
>(context: C): SnArrs {
  return Obj.keys(baseSections[context]).reduce((snArrs, sectionName) => {
    snArrs[sectionName as keyof SnArrs] = [
      sectionName,
    ] as any as SnArrs[keyof SnArrs];
    return snArrs;
  }, {} as SnArrs);
}

export const baseNameArrs = {
  fe: {
    ...snArrs("fe"),
    ...sharedBaseNames,
    all: Obj.keys(baseSections.fe),
    protected: Obj.entryKeysWithPropValue(
      baseSections.fe,
      "protected",
      true as true
    ),
  },
  db: {
    ...snArrs("db"),
    ...sharedBaseNames,
    all: Obj.keys(baseSections.db),
    protected: Obj.entryKeysWithPropValue(
      baseSections.db,
      "protected",
      true as true
    ),
  },
} as const;
const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector = keyof BaseNameArrs[SectionContext];

const sharedAndNoParentNames = [
  ...sharedBaseNames.shared,
  "no parent",
] as const;
