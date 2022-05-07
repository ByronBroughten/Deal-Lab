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
  FeVarbInfo
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  ChildFeInfo,
  ChildIdArrs,
  ChildName,
  OneChildIdArrs
} from "../SectionMetas/relSectionTypes/ChildTypes";
import { DefaultStoreName } from "../SectionMetas/relSectionTypes/DefaultStoreTypes";
import {
  FeParentInfo,
  ParentName
} from "../SectionMetas/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionMetas/SectionMeta";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS
} from "../SectionMetas/SectionName";
import { OutUpdatePack } from "../SectionMetas/VarbMeta";
import FeVarb from "./FeSection/FeVarb";
import { OutEntity } from "./FeSection/FeVarb/entities";
import {
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  insertChildFeId,
  pushChildFeId,
  removeChildFeId
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
  readonly sectionName: SN;
  readonly parentInfo: FeParentInfo<SN>;
  readonly feId?: string;

  readonly childFeIds?: Partial<OneChildIdArrs<SN, "fe">>; // empty
  readonly dbId?: string; // create new
  readonly dbVarbs?: Partial<DbVarbs>; // empty
};

export class SectionGetters<SN extends SimpleSectionName = SimpleSectionName> {
  constructor(readonly core: FeSectionCore<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get feId(): string {
    return this.core.feId;
  }
  get feIdInfo(): FeIdInfo {
    return {
      id: this.feId,
      idType: "feId",
    };
  }
  get feInfo(): FeNameInfo<SN> {
    return {
      sectionName: this.sectionName,
      ...this.feIdInfo,
    };
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get dbInfo(): DbNameInfo<SN> {
    return {
      sectionName: this.sectionName,
      id: this.dbId,
      idType: "dbId",
    };
  }
  get meta(): SectionMeta<"fe", SN> {
    return sectionMetas.section(this.core.sectionName, "fe");
  }
}

export type NewChildInfo<SN extends SimpleSectionName=SimpleSectionName> = {
  sectionName: ChildName<SN>;
  feId: string;
  idx?: number | undefined;
};

export default class FeSection<
  SN extends SimpleSectionName = SimpleSectionName
> extends SectionGetters<SN> {
  get coreClone() {
    return cloneDeep(this.core);
  }
  update(nextBaseProps: Partial<FeSectionCore<SN>>): FeSection<SN> {
    return new FeSection({ ...this.core, ...nextBaseProps });
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
  get parentOrNoInfo(): FeParentInfo<SN> {
    return this.core.parentInfo;
  }
  get parentInfo(): FeParentInfo<SN> {
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
    Extract<SN, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as FeSection<SectionName>;
    const defaultStoreName = next.meta.get("defaultStoreName");
    if (defaultStoreName) return defaultStoreName as DefaultStoreName;
    else throw new Error("This section has no defaultStoreName.");
  }

  get parentName(): ParentName<SN> {
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

  get allChildFeIds(): ChildIdArrs<SN> {
    return cloneDeep(this.core.childFeIds);
  }
  childFeIds = childFeIds;
  allChildFeInfos = allChildFeInfos;
  childFeInfos = childFeInfos;

  insertChildFeId = insertChildFeId;
  pushChildFeId = pushChildFeId;

  addChildFeId(
    childInfo: ChildFeInfo<SN>,
    idx?: number | undefined
  ): FeSection<SN> {
    if (idx === undefined) return this.pushChildFeId(childInfo);
    else return this.insertChildFeId(childInfo, idx);
  }
  addChildFeIdNext(
    childInfo: NewChildInfo<SN>,
    idx?: number | undefined
  ): FeSection<SN> {
    const feInfo = InfoS.fe(childInfo.sectionName, childInfo.feId);
    if (idx === undefined) return this.pushChildFeId(feInfo);
    else return this.insertChildFeId(feInfo, idx);
  }

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
