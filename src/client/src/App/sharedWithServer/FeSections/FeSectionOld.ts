import { cloneDeep, pick } from "lodash";
import Analyzer from "../Analyzer";
import { DbVarbs } from "../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { InEntities } from "../SectionMetas/baseSections/baseValues/entities";
import { FeInfo, InfoS } from "../SectionMetas/Info";
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
import StateVarb from "./FeSection/FeVarb";
import { OutEntity } from "./FeSection/FeVarb/entities";
import {
  addChildFeId,
  allChildFeIds,
  allChildFeInfos,
  childFeIds,
  childFeInfos,
  childIdx,
  removeChildFeId,
} from "./FeSection/methods/childIds";
import { value, values, varbInfoValues } from "./FeSection/methods/value";
import {
  replaceVarb,
  StateVarbs,
  varb,
  VarbValues,
} from "./FeSection/methods/varbs";

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

export default class SectionOld<
  S extends SimpleSectionName = SimpleSectionName
> {
  constructor(readonly core: StateSectionCore<S>) {}
  get parentArr() {
    return [...this.meta.get("parentNames")];
  }
  get coreClone() {
    return cloneDeep(this.core);
  }
  get meta(): SectionMeta<"fe", S> {
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
  get defaultStoreName(): DefaultStoreName<
    Extract<S, SectionName<"hasDefaultStore">>
  > {
    const next = this as any as SectionOld<SectionName>;
    if (SectionOld.is(next, "hasDefaultStore")) {
      return next.meta.core.defaultStoreName;
    } else throw new Error("This section has no defaultStoreName.");
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
  update(nextBaseProps: Partial<StateSectionCore<S>>): SectionOld<S> {
    return new SectionOld({ ...this.core, ...nextBaseProps });
  }

  static is<ST extends FeSectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is SectionOld<SectionName<ST>> {
    if (!(value instanceof SectionOld)) return false;
    return sectionNameS.is(value.sectionName, (sectionType ?? "all") as ST);
  }
  static init<S extends SectionName>({
    feId,
    sectionName,
    parentInfo,
    options: { dbId = Analyzer.makeId(), values } = {},
  }: InitStateSectionProps<S>): SectionOld<S> {
    const stateSectionCore: StateSectionCore<S> = {
      feId,
      dbId,
      sectionName,
      parentInfo,
      childFeIdArrs: initChildFeIds(sectionName),
      varbs: initVarbs(InfoS.fe(sectionName, feId), values),
    };
    return new SectionOld(stateSectionCore);
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
