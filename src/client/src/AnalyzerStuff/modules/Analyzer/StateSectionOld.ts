import { cloneDeep, pick } from "lodash";
import { sectionMetas } from "../../../App/sharedWithServer/SectionsMeta";
import { SimpleSectionName } from "../../../App/sharedWithServer/SectionsMeta/baseSections";
import { InEntities } from "../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { FeInfo, InfoS } from "../../../App/sharedWithServer/SectionsMeta/Info";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
} from "../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildIdArrsWide } from "../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import {
  ParentFeInfo,
  ParentName,
} from "../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import { SectionMeta } from "../../../App/sharedWithServer/SectionsMeta/SectionMeta";
import {
  FeSectionNameType,
  SectionName,
  sectionNameS,
} from "../../../App/sharedWithServer/SectionsMeta/SectionName";
import { OutUpdatePack } from "../../../App/sharedWithServer/SectionsMeta/VarbMeta";
import { DbVarbs } from "../../types/DbEntry";
import Analyzer from "../Analyzer";
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
  proposed: Partial<ChildIdArrsWide<SN>> = {}
): ChildIdArrsWide<SN> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIdsWide(),
    ...pick(proposed, [
      sectionMeta.get("childNames") as any as keyof ChildIdArrsWide<SN>,
    ]),
  };
}

export type StorableCore = {
  dbId: string;
  varbs: StateVarbs; // StateVarbs should be variably permissive
};

type ClientCore<S extends SectionName> = {
  feId: string;
  parentInfo: ParentFeInfo<S>;
  sectionName: S;

  // childFeIdArrs are initialized as empty; ids added as children are added
  childFeIdArrs: ChildIdArrsWide<S>;
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
      varbs: initVarbs(InfoS.fe(sectionName, feId), values),
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
