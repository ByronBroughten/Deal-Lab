import { cloneDeep } from "lodash";
import { DbVarbs } from "../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { InEntities } from "../SectionMetas/baseSections/baseValues/entities";
import { FeIdInfo } from "../SectionMetas/baseSections/id";
import { InfoS } from "../SectionMetas/Info";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../SectionMetas/relSectionTypes/ChildTypes";
import { DefaultStoreName } from "../SectionMetas/relSectionTypes/DefaultStoreTypes";
import {
  FeParentInfo,
  ParentName,
} from "../SectionMetas/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionMetas/SectionMeta";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "../SectionMetas/SectionName";
import { OutUpdatePack } from "../SectionMetas/VarbMeta";
import FeVarb from "./FeSection/FeVarb";
import { OutEntity } from "./FeSection/FeVarb/entities";
import {
  addChildFeId,
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  insertChildFeId,
  pushChildFeId,
  removeChildFeId,
} from "./FeSection/methods/childIds";
import { initStateSection } from "./FeSection/methods/initStateSection";
import { initStateSectionNext } from "./FeSection/methods/initStateSectionNext";
import { value, values, varbInfoValues } from "./FeSection/methods/value";
import { replaceVarb, StateVarbs, varb } from "./FeSection/methods/varbs";

export type FeSectionCore<SN extends SectionName> = {
  feId: string;
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  dbId: string;
  varbs: StateVarbs;
  childFeIds: OneChildIdArrs<SN, "fe">;
};

export type SectionInitProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string;

  childFeIds?: Partial<OneChildIdArrs<SN, "fe">>; // empty
  dbId?: string; // create new
  dbVarbs?: Partial<DbVarbs>; // empty
};

export default class FeSection<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: FeSectionCore<S>) {}
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): SectionMeta<"fe", S> {
    return sectionMetas.section(this.core.sectionName, "fe");
  }

  update(nextBaseProps: Partial<FeSectionCore<S>>): FeSection<S> {
    return new FeSection({ ...this.core, ...nextBaseProps });
  }

  get feIdInfo(): FeIdInfo {
    return {
      id: this.feId,
      idType: "feId",
    };
  }
  get feInfo(): FeNameInfo<S> {
    const sectionName = this.meta.get("sectionName") as SectionName as S;
    return {
      sectionName,
      ...this.feIdInfo,
    };
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
  get varbArr(): FeVarb[] {
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
  get defaultStoreName(): DefaultStoreName<
    Extract<S, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as FeSection<SectionName>;
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

  static is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is FeSection<SectionName<ST>> {
    if (!(value instanceof FeSection)) return false;
    return sectionNameS.is(value.sectionName, (sectionType ?? "all") as ST);
  }

  static init = initStateSection;
  static initNext = initStateSectionNext;

  get allChildFeIds(): ChildIdArrs<S> {
    return cloneDeep(this.core.childFeIds);
  }
  childFeIds = childFeIds;
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
}
