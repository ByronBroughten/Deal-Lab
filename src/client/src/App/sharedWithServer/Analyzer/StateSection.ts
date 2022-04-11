import { cloneDeep } from "lodash";
import { DbVarbs } from "./DbEntry";
import { sectionMetas } from "./SectionMetas";
import { Inf } from "./SectionMetas/Info";
import { OneChildIdArrs } from "./SectionMetas/relNameArrs/ChildTypes";
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
  SectionNam,
  SectionName,
} from "./SectionMetas/SectionName";
import { OutUpdatePack } from "./SectionMetas/VarbMeta";
import {
  addChildFeId,
  allChildFeIds,
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  insertChildFeId,
  pushChildFeId,
  removeChildFeId,
} from "./StateSection/methods/childIds";
import { initStateSection } from "./StateSection/methods/initStateSection";
import { initStateSectionNext } from "./StateSection/methods/initStateSectionNext";
import { value, values, varbInfoValues } from "./StateSection/methods/value";
import { replaceVarb, StateVarbs, varb } from "./StateSection/methods/varbs";
import StateVarb from "./StateSection/StateVarb";
import { OutEntity } from "./StateSection/StateVarb/entities";

export type NextStateSectionCore<SN extends SectionName> = {
  feId: string;
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  dbId: string;
  varbs: StateVarbs;
  childFeIds: OneChildIdArrs<SN, "fe">;
};

export type NextStateSectionInitProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string;

  childFeIds?: Partial<OneChildIdArrs<SN, "fe">>; // empty
  dbId?: string; // create new
  dbVarbs?: Partial<DbVarbs>; // empty
};

// childFeIdArrs, feId, dbId, parentInfo, sectionName, varbs

export type StateSectionCore<SN extends SimpleSectionName> =
  NextStateSectionCore<SN>;
export default class StateSection<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: StateSectionCore<S>) {}
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): NextSectionMeta<"fe", S> {
    return sectionMetas.section(this.core.sectionName, "fe");
  }

  update(nextBaseProps: Partial<StateSectionCore<S>>): StateSection<S> {
    return new StateSection({ ...this.core, ...nextBaseProps });
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
  get childNames() {
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

  static is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is StateSection<SectionName<ST>> {
    if (!(value instanceof StateSection)) return false;
    return SectionNam.is(value.sectionName, (sectionType ?? "all") as ST);
  }

  static init = initStateSection;
  static initNext = initStateSectionNext;

  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  allChildFeInfos = allChildFeInfos;
  childFeInfos = childFeInfos;

  insertChildFeId = insertChildFeId;
  pushChildFeId = pushChildFeId;
  addChildFeId = addChildFeId;
  removeChildFeId = removeChildFeId;
  childIdx = childIdx;

  varb = varb;
  replaceVarb = replaceVarb;
  value = value;
  values = values;
  varbInfoValues = varbInfoValues;
}
