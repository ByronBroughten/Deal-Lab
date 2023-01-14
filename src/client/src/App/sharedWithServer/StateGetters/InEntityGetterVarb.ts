import { cloneDeep } from "lodash";
import {
  FixedInEntity,
  InEntity,
  ValueInEntity,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { UpdateOverrideSwitch } from "../SectionsMeta/relSectionVarbs/rel/updateVarb/UpdateOverrides";
import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { InUpdatePack } from "../SectionsMeta/VarbMeta";
import { InVarbInfo } from "../StateSolvers/SolverVarb";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterVarb } from "./GetterVarb";

export class InEntityGetterVarb<
  SN extends SectionName = SectionName
> extends GetterVarbBase<SN> {
  entityGetter<SN extends SectionName>(
    feVarbInfo: FeVarbInfo<SN>
  ): InEntityGetterVarb<SN> {
    return new InEntityGetterVarb({
      ...this.getterSectionsProps,
      ...feVarbInfo,
    });
  }
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get meta() {
    return this.sectionMeta.varb(this.varbName);
  }
  get updateFnName() {
    return this.activeUpdatePack.updateFnName;
  }
  get updateFnProps() {
    return this.activeUpdatePack.updateFnProps;
  }
  get hasInEntities(): boolean {
    return this.allInEntities.length > 0;
  }
  get hasActiveInEntities(): boolean {
    return this.activeInEntities.length > 0;
  }
  isActiveInEntity(entityId: string): boolean {
    return this.activeInEntities.some((entity) => entity.entityId === entityId);
  }
  get activeUpdatePack(): InUpdatePack {
    const { inSwitchUpdatePacks, inDefaultUpdatePack } = this.meta;
    for (const pack of inSwitchUpdatePacks) {
      const { switches, ...rest } = pack;
      if (switches.every((updateSwitch) => this.switchIsActive(updateSwitch))) {
        return rest;
      }
    }
    return inDefaultUpdatePack;
  }
  private switchIsActive({
    switchInfo,
    switchValue,
  }: UpdateOverrideSwitch): boolean {
    const actualSwitchValue = this.get.section
      .varbByFocalMixed(switchInfo)
      .value();
    return switchValue === actualSwitchValue;
  }
  get allFixedInEntities() {
    const allFixedInEntities: FixedInEntity[] = [];
    const { inSwitchUpdatePacks, inDefaultUpdatePack } = this.meta;
    for (const pack of inSwitchUpdatePacks) {
      allFixedInEntities.push(...pack.fixedInEntities);
    }
    allFixedInEntities.push(...inDefaultUpdatePack.fixedInEntities);
    return allFixedInEntities;
  }
  get activeFixedInEntities() {
    return this.activeUpdatePack.fixedInEntities;
  }
  get valueInEntities(): ValueInEntity[] {
    const val = this.get.value("any");
    if (val && typeof val === "object" && "entities" in val) {
      return cloneDeep(val.entities);
    } else return [];
  }
  get activeInEntities(): InEntity[] {
    return [...this.activeFixedInEntities, ...this.valueInEntities];
  }
  get allInEntities(): InEntity[] {
    return [...this.allFixedInEntities, ...this.valueInEntities];
  }
  get activeMixedFeInfos(): InVarbInfo[] {
    return [...this.activeFixedMixedInfos, ...this.valueInEntities];
  }
  private get activeFixedMixedInfos(): InVarbInfo[] {
    return this.activeFixedInEntities.reduce((inFeInfos, inRelInfo) => {
      const varbs = this.get.varbsByFocalMixed(inRelInfo);
      return inFeInfos.concat(varbs.map((varb) => varb.feVarbInfoMixed));
    }, [] as InVarbInfo[]);
  }
  inEntity(entityId: string): InEntity {
    const inEntity = this.allInEntities.find(
      (entity) => entity.entityId === entityId
    );
    if (!inEntity) throw this.inEntityNotFoundError(entityId);
    else return inEntity;
  }
  valueInEntityText(entityId: string): string {
    const inEntity = this.valueInEntity(entityId);
    const { mainText } = this.get.value("numObj");
    const { length, offset } = inEntity;
    return mainText.substring(offset, offset + length);
  }
  valueInEntity(entityId: string): ValueInEntity {
    const inEntity = this.valueInEntities.find(
      (entity) => entity.entityId === entityId
    );
    if (!inEntity) throw this.inEntityNotFoundError(entityId);
    else return inEntity;
  }
  inEntityNotFoundError(entityId: string): Error {
    return new Error(
      `inEntity with entityId ${entityId} not found at ${this.sectionName}.${this.feId}.${this.varbName}`
    );
  }
}
