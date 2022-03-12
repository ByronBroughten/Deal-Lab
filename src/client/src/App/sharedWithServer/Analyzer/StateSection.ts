import { cloneDeep } from "lodash";
import Analyzer from "../Analyzer";
import { DbSection, DbVarbs } from "./DbEntry";
import { DbSectionInit } from "./methods/protected/addSections";
import { SectionMeta, sectionMetas } from "./SectionMetas";
import { InEntities } from "./SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  ChildIdArrs,
  DefaultStoreName,
  FeParentInfo,
  IndexStoreName,
  ParentName,
} from "./SectionMetas/relSectionTypes";
import { Inf } from "./SectionMetas/Info";
import { OutUpdatePack } from "./SectionMetas/VarbMeta";
import {
  addChildFeId,
  allChildFeIds,
  childFeIds,
  childIdx,
  initChildFeIds,
  removeChildFeId,
} from "./StateSection/methods/childIds";
import StateVarb from "./StateSection/StateVarb";
import { OutEntities } from "./StateSection/StateVarb/entities";
import { value, values, varbInfoValues } from "./StateSection/methods/value";
import {
  initVarbs,
  replaceVarb,
  StateVarbs,
  varb,
  VarbSeeds,
  VarbValues,
} from "./StateSection/methods/varbs";
import {
  FeSectionNameType,
  SectionNam,
  SectionName,
} from "./SectionMetas/SectionName";

export type SectionSeed = Omit<VarbSeeds, "dbVarbs"> & {
  dbSectionInit?: DbSectionInit;
};

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

export type StringDisplayNames = { [varbName: string]: string };
export type StateSectionCore<S extends SectionName> = StorableCore &
  ClientCore<S>;

export default class StateSection<S extends SectionName = SectionName> {
  constructor(readonly core: StateSectionCore<S>) {}
  get parentArr() {
    return [...this.meta.parents];
  }
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): SectionMeta<S> {
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
      sectionName: this.meta.sectionName as S,
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
      !SectionNam.is(this.sectionName, "hasParent") ||
      parentInfo.sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return parentInfo as FeParentInfo<SectionName<"hasParent">>;
  }
  get indexStoreName(): IndexStoreName<
    Extract<S, SectionName<"hasIndexStore">>
  > {
    const next = this as any as StateSection<SectionName>;
    if (StateSection.is(next, "hasIndexStore")) {
      return next.meta.indexStoreName;
    } else throw new Error("This section has no indexStoreName.");
  }
  get defaultStoreName(): DefaultStoreName<
    Extract<S, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as StateSection<SectionName>;
    if (StateSection.is(next, "hasDefaultStore")) {
      return next.meta.indexStoreName;
    } else throw new Error("This section has no indexStoreName.");
  }

  get parentName(): ParentName<S> {
    return this.core.parentInfo.sectionName;
  }
  get parentNameSafe(): ParentName<SectionName<"hasParent">> {
    const { sectionName } = this.core.parentInfo;
    if (
      !SectionNam.is(this.sectionName, "hasParent") ||
      sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return sectionName as ParentName<SectionName<"hasParent">>;
  }
  get childNames(): readonly string[] {
    return this.meta.childSectionNames;
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
  outEntities(): OutEntities {
    return this.varbArr.reduce((outEntities, varb) => {
      return outEntities.concat(varb.outEntities);
    }, [] as OutEntities);
  }
  toDbVarbs(): DbVarbs {
    return Object.entries(this.varbs).reduce((dbVarbs, [varbName, varb]) => {
      dbVarbs[varbName] = varb.toDbValue();
      return dbVarbs;
    }, {} as DbVarbs);
  }
  toDbSection(childDbIds: ChildIdArrs<S>, dbId?: string): DbSection {
    return {
      dbId: dbId ?? this.dbId,
      dbVarbs: this.toDbVarbs(),
      childDbIds,
    };
  }
  update(nextBaseProps: Partial<StateSectionCore<S>>): StateSection<S> {
    return new StateSection({ ...this.core, ...nextBaseProps });
  }

  static is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is StateSection<SectionName<ST>> {
    if (!(value instanceof StateSection)) return false;
    return SectionNam.is(value.sectionName, (sectionType ?? "all") as ST);
  }
  static init<S extends SectionName>({
    feId,
    sectionName,
    parentInfo,
    options: { dbId = Analyzer.makeId(), values } = {},
  }: InitStateSectionProps<S>): StateSection<S> {
    const stateSectionCore: StateSectionCore<S> = {
      feId,
      dbId,
      sectionName,
      parentInfo,
      childFeIdArrs: this.initChildFeIds(sectionName),
      varbs: StateSection.initVarbs(Inf.fe(sectionName, feId), values),
    };
    return new StateSection(stateSectionCore);
  }

  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  static initChildFeIds = initChildFeIds;
  addChildFeId = addChildFeId;
  removeChildFeId = removeChildFeId;
  childIdx = childIdx;

  varb = varb;
  replaceVarb = replaceVarb;
  static initVarbs = initVarbs;

  value = value;
  values = values;
  varbInfoValues = varbInfoValues;
}
