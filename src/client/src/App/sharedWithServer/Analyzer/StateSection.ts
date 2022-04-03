import { cloneDeep } from "lodash";
import Analyzer from "../Analyzer";
import { DbVarbs } from "./DbEntry";
import { DbSectionInit } from "./methods/internal/addSections";
import { sectionMetas } from "./SectionMetas";
import { InEntities } from "./SectionMetas/relSections/baseSections/baseValues/NumObj/entities";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import { Inf } from "./SectionMetas/Info";
import { OutUpdatePack } from "./SectionMetas/VarbMeta";
import {
  allChildFeIds,
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  initChildFeIds,
  insertChildFeId,
  pushChildFeId,
  removeChildFeId,
} from "./StateSection/methods/childIds";
import StateVarb from "./StateSection/StateVarb";
import { OutEntity } from "./StateSection/StateVarb/entities";
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
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "./SectionMetas/relNameArrs/ChildTypes";
import {
  DefaultStoreName,
  IndexStoreName,
} from "./SectionMetas/relNameArrs/StoreTypes";
import {
  FeParentInfo,
  ParentName,
} from "./SectionMetas/relNameArrs/ParentTypes";
import { SimpleSectionName } from "./SectionMetas/relSections/baseSections";
import { Id } from "./SectionMetas/relSections/baseSections/id";
import { NextSectionMeta } from "./SectionMetas/SectionMeta";

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

export type NextStateSectionInitProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string; // is this needed? No, not really.

  childFeIds?: Partial<OneChildIdArrs<SN, "fe">>; // empty
  dbId?: string; // create new
  dbVarbs?: Partial<DbVarbs>; // empty
};

export type InitStateSectionProps<S extends SectionName> = Pick<
  ClientCore<S>,
  "feId" | "parentInfo" | "sectionName"
> & {
  options?: { dbId?: string; values?: VarbValues };
};

export type StringDisplayNames = { [varbName: string]: string };
export type StateSectionCore<S extends SimpleSectionName> = StorableCore &
  ClientCore<S>;

export default class StateSection<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: StateSectionCore<S>) {}
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): NextSectionMeta<"fe", S> {
    return sectionMetas.get(this.core.sectionName, "fe");
  }
  get feInfo(): FeNameInfo<S> {
    const sectionName = this.meta.get("sectionName") as SectionName as S;
    const feInfo: FeNameInfo<S> = {
      sectionName,
      id: this.feId,
      idType: "feId",
    };
    return feInfo;
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get feId(): string {
    return this.core.feId;
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
      !SectionNam.is(this.sectionName, "hasParent") ||
      parentInfo.sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return parentInfo as FeParentInfo<SectionName<"hasParent">>;
  }
  get indexStoreName(): IndexStoreName<
    Extract<S, SectionName<"hasIndexStore">>
  > {
    const next = this as any;
    if (StateSection.is(next, "hasIndexStore")) {
      return next.meta.get("indexStoreName");
    } else throw new Error("This section has no indexStoreName.");
  }
  get defaultStoreName(): DefaultStoreName<
    Extract<S, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as StateSection<SectionName>;
    const defaultStoreName = next.meta.get("defaultStoreName");
    if (defaultStoreName) return defaultStoreName as DefaultStoreName;
    else throw new Error("This section has no defaultStoreName.");
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
    return this.meta.get("childSectionNames");
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
  static defaultInitVarbs() {}
  static defaultInitProps<SN extends SectionName>({
    sectionName,
    childFeIds = {},
    dbVarbs = {},
  }: NextStateSectionInitProps<SN>) {
    // sectionName: SN;
    // parentInfo: FeParentInfo<SN>;
    // feId?: string; // is this needed? No, not really.

    // childFeIds?: OneChildIdArrs<SN, "fe">; // empty
    // dbId?: string; // create new
    // dbVarbs?: DbVarbs; // empty

    //
    return {
      feId: Id.make(),
      dbId: Id.make(),
      childFeIdArrs: this.initChildFeIds(sectionName, childFeIds),
      dbVarbs: {
        ...sectionMetas.get(sectionName).defaultDbVarbs(),
        ...dbVarbs,
      },
    };
  }
  static nextInit<SN extends SectionName>(
    props: NextStateSectionInitProps<SN>
  ) {
    // sectionName: SN;
    // feId?: string;
    // childFeIds?: OneChildIdArrs<SN, "fe">;
    // dbId?: string;
    // dbVarbs?: DbVarbs;
    // idx?: number;
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
  allChildFeInfos = allChildFeInfos;
  childFeInfos = childFeInfos;

  insertChildFeId = insertChildFeId;
  pushChildFeId = pushChildFeId;
  static initChildFeIds = initChildFeIds;
  removeChildFeId = removeChildFeId;
  childIdx = childIdx;

  varb = varb;
  replaceVarb = replaceVarb;
  static initVarbs = initVarbs;

  value = value;
  values = values;
  varbInfoValues = varbInfoValues;
}
