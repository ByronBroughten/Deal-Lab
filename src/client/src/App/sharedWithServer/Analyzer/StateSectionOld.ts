import { cloneDeep, pick } from "lodash";
import Analyzer from "../Analyzer";
import { DbVarbs } from "./DbEntry";
import { sectionMetas } from "./SectionMetas";
import { FeInfo, Inf } from "./SectionMetas/Info";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "./SectionMetas/relNameArrs/ChildTypes";
import {
  FeParentInfo,
  ParentName,
} from "./SectionMetas/relNameArrs/ParentTypes";
import {
  DefaultStoreName,
  IndexStoreName,
} from "./SectionMetas/relNameArrs/StoreTypes";
import { SimpleSectionName } from "./SectionMetas/relSections/baseSections";
import { InEntities } from "./SectionMetas/relSections/baseSections/baseValues/NumObj/entities";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import { NextSectionMeta } from "./SectionMetas/SectionMeta";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "./SectionMetas/SectionName";
import { OutUpdatePack } from "./SectionMetas/VarbMeta";
import {
  addChildFeId,
  allChildFeIds,
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  removeChildFeId,
} from "./StateSection/methods/childIds";
import { value, values, varbInfoValues } from "./StateSection/methods/value";
import {
  replaceVarb,
  StateVarbs,
  varb,
  VarbValues,
} from "./StateSection/methods/varbs";
import StateVarb from "./StateSection/StateVarb";
import { OutEntity } from "./StateSection/StateVarb/entities";

export function initVarbs(feInfo: FeInfo, values: VarbValues = {}): StateVarbs {
  const nextVarbs: StateVarbs = {};
  const { sectionName, id } = feInfo;
  const varbMetas = sectionMetas.varbs(sectionName);
  for (const [varbName, varbMeta] of Object.entries(varbMetas.getCore())) {
    const proposedValue = values[varbName];
    const isValidProposal =
      varbName in values && varbMeta.isVarbValueType(proposedValue);
    const value = isValidProposal ? proposedValue : varbMeta.initValue;
    nextVarbs[varbName] = StateVarb.init({
      varbName,
      sectionName,
      feId: id,
      dbVarb: value,
    });
  }
  return nextVarbs;
}

function initChildFeIds<SN extends SectionName>(
  sectionName: SN,
  proposed: Partial<ChildIdArrs<SN>> = {}
): OneChildIdArrs<SN, "fe"> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIds(),
    ...pick(proposed, [
      sectionMeta.get("childNames") as any as keyof ChildIdArrs<SN>,
    ]),
  };
}

export type StorableCore = {
  dbId: string;
  varbs: StateVarbs; // StateVarbs should be variably permissive
};

type ClientCore<S extends SectionName> = {
  feId: string;
  parentInfo: FeParentInfo<S>;
  sectionName: S;

  // childFeIdArrs are initialized as empty; ids added as children are added
  childFeIdArrs: ChildIdArrs<S>;
};

export type InitStateSectionProps<S extends SectionName> = Pick<
  ClientCore<S>,
  "feId" | "parentInfo" | "sectionName"
> & {
  options?: { dbId?: string; values?: VarbValues };
};

export type StateSectionCore<S extends SimpleSectionName> = StorableCore &
  ClientCore<S>;

export default class StateSectionOld<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: StateSectionCore<S>) {}
  get parentArr() {
    return [...this.meta.get("parents")];
  }
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): NextSectionMeta<"fe", S> {
    return cloneDeep(sectionMetas.get(this.core.sectionName));
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get feId(): string {
    return this.core.feId;
  }
  get feInfo(): FeNameInfo<S> {
    const feInfo: FeNameInfo<S> = {
      sectionName: this.meta.core.sectionName as S,
      id: this.feId,
      idType: "feId",
    };
    return feInfo;
  }
  get dbInfo(): DbNameInfo<S> {
    return {
      sectionName: this.sectionName,
      id: this.dbId,
      idType: "dbId",
    };
  }
  get parentFeId(): string {
    return this.core.parentInfo.id;
  }
  get varbs(): StateVarbs {
    return { ...this.core.varbs };
  }
  get dbVarbs(): DbVarbs {
    return Object.entries(this.varbs).reduce((dbVarbs, [varbName, varb]) => {
      dbVarbs[varbName] = varb.toDbValue();
      return dbVarbs;
    }, {} as DbVarbs);
  }
  get varbArr(): StateVarb[] {
    return Object.values(this.varbs);
  }
  get sectionName(): S {
    return this.core.sectionName;
  }
  get parentOrNoInfo(): FeParentInfo<S> {
    return this.core.parentInfo;
  }
  get parentInfo(): FeParentInfo<S> {
    return this.core.parentInfo;
  }
  get parentInfoSafe(): FeParentInfo<SectionName<"hasParent">> {
    const { parentInfo } = this.core;
    if (
      !sectionNameS.is(this.sectionName, "hasParent") ||
      parentInfo.sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return parentInfo as FeParentInfo<SectionName<"hasParent">>;
  }
  get indexStoreName(): IndexStoreName<
    Extract<S, SectionName<"hasIndexStore">>
  > {
    const next = this as any;
    if (StateSectionOld.is(next, "hasIndexStore")) {
      return next.meta.core.indexStoreName;
    } else throw new Error("This section has no indexStoreName.");
  }
  get defaultStoreName(): DefaultStoreName<
    Extract<S, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as StateSectionOld<SectionName>;
    if (StateSectionOld.is(next, "hasDefaultStore")) {
      return next.meta.core.indexStoreName;
    } else throw new Error("This section has no indexStoreName.");
  }

  get parentName(): ParentName<S> {
    return this.core.parentInfo.sectionName;
  }
  get parentNameSafe(): ParentName<SectionName<"hasParent">> {
    const { sectionName } = this.core.parentInfo;
    if (
      !sectionNameS.is(this.sectionName, "hasParent") ||
      sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return sectionName as ParentName<SectionName<"hasParent">>;
  }
  get childNames(): readonly string[] {
    return this.meta.get("childNames");
  }
  get feVarbInfos(): FeVarbInfo[] {
    const { feInfo } = this;
    if (!Inf.is.fe(feInfo, "hasVarb")) return [];
    return Object.keys(this.varbs).map((varbName) => ({
      ...feInfo,
      varbName,
    }));
  }
  get entities(): InEntities {
    return this.varbArr.reduce((inEntities, varb) => {
      inEntities = inEntities.concat(varb.inEntities);
      return inEntities;
    }, [] as InEntities);
  }
  outVarbPacks(): OutUpdatePack[] {
    return this.varbArr.reduce((outUpdatePacks, varb) => {
      return outUpdatePacks.concat(varb.outUpdatePacks);
    }, [] as OutUpdatePack[]);
  }
  outEntities(): OutEntity[] {
    return this.varbArr.reduce((outEntities, varb) => {
      return outEntities.concat(varb.outEntities);
    }, [] as OutEntity[]);
  }

  update(nextBaseProps: Partial<StateSectionCore<S>>): StateSectionOld<S> {
    return new StateSectionOld({ ...this.core, ...nextBaseProps });
  }

  static is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is StateSectionOld<SectionName<ST>> {
    if (!(value instanceof StateSectionOld)) return false;
    return sectionNameS.is(value.sectionName, (sectionType ?? "all") as ST);
  }
  static init<S extends SectionName>({
    feId,
    sectionName,
    parentInfo,
    options: { dbId = Analyzer.makeId(), values } = {},
  }: InitStateSectionProps<S>): StateSectionOld<S> {
    const stateSectionCore: StateSectionCore<S> = {
      feId,
      dbId,
      sectionName,
      parentInfo,
      childFeIdArrs: initChildFeIds(sectionName),
      varbs: initVarbs(Inf.fe(sectionName, feId), values),
    };
    return new StateSectionOld(stateSectionCore);
  }

  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  allChildFeInfos = allChildFeInfos;
  childFeInfos = childFeInfos;

  addChildFeId = addChildFeId;
  removeChildFeId = removeChildFeId;
  childIdx = childIdx;

  varb = varb;
  replaceVarb = replaceVarb;

  value = value;
  values = values;
  varbInfoValues = varbInfoValues;
}
