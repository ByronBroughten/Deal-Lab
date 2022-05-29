import { cloneDeep } from "lodash";
import { sectionMetas } from "../SectionsMeta";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { InEntities } from "../SectionsMeta/baseSections/baseValues/entities";
import { InfoS } from "../SectionsMeta/Info";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildIdArrsWide } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { DefaultStoreName } from "../SectionsMeta/relSectionTypes/DefaultStoreTypes";
import {
  ParentFeInfo,
  ParentName,
} from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "../SectionsMeta/SectionName";
import { OutUpdatePack } from "../SectionsMeta/VarbMeta";
import { DbVarbs } from "./DbEntry";
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
  updateChildFeIdArr,
} from "./StateSection/methods/childIds";
import { initStateSection } from "./StateSection/methods/initStateSection";
import { initStateSectionNext } from "./StateSection/methods/initStateSectionNext";
import { value, values, varbInfoValues } from "./StateSection/methods/value";
import { replaceVarb, StateVarbs, varb } from "./StateSection/methods/varbs";
import StateVarb from "./StateSection/StateVarb";
import { OutEntity } from "./StateSection/StateVarb/entities";

export type StateSectionCore<SN extends SectionName> = {
  feId: string;
  parentInfo: ParentFeInfo<SN>;
  sectionName: SN;
  dbId: string;
  varbs: StateVarbs;
  childFeIds: ChildIdArrsWide<SN>;
};

export type StateSectionInitProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: ParentFeInfo<SN>;
  feId?: string;

  childFeIds?: Partial<ChildIdArrsWide<SN>>; // empty
  dbId?: string; // create new
  dbVarbs?: Partial<DbVarbs>; // empty
};

export default class StateSection<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: StateSectionCore<S>) {}
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): SectionMeta<"fe", S> {
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
  get parentOrNoInfo(): ParentFeInfo<S> {
    return this.core.parentInfo;
  }
  get parentInfo(): ParentFeInfo<S> {
    return this.core.parentInfo;
  }
  get parentInfoSafe(): ParentFeInfo<SectionName<"hasParent">> {
    const { parentInfo } = this.core;
    if (
      !sectionNameS.is(this.sectionName, "hasParent") ||
      parentInfo.sectionName === "no parent"
    )
      throw new Error("This section doesn't have a parent.");
    return parentInfo as ParentFeInfo<SectionName<"hasParent">>;
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
      !sectionNameS.is(this.sectionName, "hasParent") ||
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
    if (!InfoS.is.fe(feInfo, "hasVarb")) return [];
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
    return sectionNameS.is(value.sectionName, (sectionType ?? "all") as ST);
  }

  static init = initStateSection;
  static initNext = initStateSectionNext;

  childFeIds = childFeIds;
  allChildFeIds = allChildFeIds;
  allChildFeInfos = allChildFeInfos;
  childFeInfos = childFeInfos;

  updateChildFeIdArr = updateChildFeIdArr;
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
