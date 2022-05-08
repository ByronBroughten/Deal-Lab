import { cloneDeep } from "lodash";
import { applyMixins } from "../../utils/classObjects";
import { DbVarbs } from "../Analyzer/SectionPackRaw/RawSection";
import { InEntities } from "../SectionMetas/baseSections/baseValues/entities";
import { InfoS } from "../SectionMetas/Info";
import {
  DbNameInfo,
  FeVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { DefaultStoreName } from "../SectionMetas/relSectionTypes/DefaultStoreTypes";
import {
  FeParentInfo,
  ParentName,
} from "../SectionMetas/relSectionTypes/ParentTypes";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "../SectionMetas/SectionName";
import { OutUpdatePack } from "../SectionMetas/VarbMeta";
import FeVarb from "./FeSection/FeVarb";
import { OutEntity } from "./FeSection/FeVarb/entities";
import { ChildIdGetter } from "./FeSection/methods/ChildIdGetter";
import { ChildIdUpdater } from "./FeSection/methods/ChildIdUpdater";
import { initStateSection } from "./FeSection/methods/initStateSection";
import { initStateSectionNext } from "./FeSection/methods/initStateSectionNext";
import { value, values, varbInfoValues } from "./FeSection/methods/value";
import { replaceVarb, varb } from "./FeSection/methods/varbs";
import { FeSectionBasicUpdater, FeSectionCore, FeVarbs } from "./FeSectionCore";
import { SectionInfoClass, SectionInfoGetters } from "./SectionInfoClass";

class HasFeSectionProps<SN extends SectionName> extends SectionInfoClass<SN> {
  constructor(readonly core: FeSectionCore<SN>) {
    super(core);
  }
}

export default class FeSection<
  SN extends SectionName = SectionName
> extends HasFeSectionProps<SN> {
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
  get coreClone() {
    return cloneDeep(this.core);
  }
  get parentFeId(): string {
    return this.core.parentInfo.id;
  }
  get varbs(): FeVarbs {
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

export default interface FeSection<SN extends SectionName = SectionName>
  extends SectionInfoGetters<SN>,
    ChildIdGetter<SN>,
    FeSectionBasicUpdater<SN>,
    ChildIdUpdater<SN> {}

applyMixins(FeSection, [
  SectionInfoGetters,
  ChildIdGetter,
  FeSectionBasicUpdater,
  ChildIdUpdater,
]);
