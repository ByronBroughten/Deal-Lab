import { OutEntity } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { RelVarbInfo } from "../SectionsMeta/SectionInfo/RelVarbInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  OutDefaultPack,
  OutSwitchPack,
  VarbMeta,
} from "../SectionsMeta/VarbMeta";
import {
  GetterVarbBase,
  GetterVarbProps,
} from "../StateGetters/Bases/GetterVarbBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";

export class OutVarbGetterVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  private outVarbInfoStore: FeVarbInfo[];
  constructor(props: GetterVarbProps<SN>) {
    super(props);
    this.outVarbInfoStore = [];
  }
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  private get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get activeOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.activeOutEntities);
  }
  get outEntities(): OutEntity[] {
    return this.get.raw.outEntities;
  }
  private gatherOutVarbInfos() {
    this.outVarbInfoStore = [];
    this.gatherOutEntities();
    this.gatherOutRelatives();
  }
  private gatherOutEntities() {
    const feOutEntities = this.outEntities.map((outEntity) => {
      const varb = this.getterSections.varb(outEntity);
      return varb.feVarbInfo;
    });
    this.outVarbInfoStore.push(...feOutEntities);
  }
  get filteredOutUpdatePacks() {
    const { outUpdatePacks } = this.get.meta;
    return outUpdatePacks.filter(({ relTargetVarbInfo: info }) => {
      switch (info.infoType) {
        case "parent": {
          return info.parentName === this.get.section.parentName;
        }
        case "local": {
          return true;
        }
        case "niblingIfOfHasChildName": {
          return info.selfChildName === this.get.section.selfChildName;
        }
        case "stepSiblingOfHasChildName": {
          return info.selfChildName === this.get.section.selfChildName;
        }
      }
    });
  }
  get activeOutEntities(): OutEntity[] {
    return this.outEntities.filter((outEntity) => {
      const varb = new InEntityGetterVarb({
        ...outEntity,
        ...this.getterSectionsProps,
      });
      return varb.isActiveInEntity(outEntity.entityId);
    });
  }

  private gatherOutRelatives() {
    for (const outUpdatePack of this.filteredOutUpdatePacks) {
      if (VarbMeta.isSwitchOutPack(outUpdatePack)) {
        this.gatherFromSwitchUpdatePack(outUpdatePack);
      } else {
        this.gatherFromDefaultUpdatePack(outUpdatePack);
      }
    }
  }
  private gatherFromSwitchUpdatePack({
    relTargetVarbInfo,
    switchInfo,
    switchValue,
  }: OutSwitchPack) {
    const targetVarbInfos = this.relativesToFeVarbInfos(
      relTargetVarbInfo as RelVarbInfo
    );
    for (const targetInfo of targetVarbInfos) {
      const targetVarb = this.inEntity.entityGetter(targetInfo);
      if (targetVarb.switchIsActive(switchInfo, switchValue))
        this.outVarbInfoStore.push(targetInfo);
    }
  }
  private gatherFromDefaultUpdatePack({
    relTargetVarbInfo,
    inverseSwitches,
  }: OutDefaultPack) {
    const targetVarbInfos = this.relativesToFeVarbInfos(
      relTargetVarbInfo as RelVarbInfo
    );
    for (const targetInfo of targetVarbInfos) {
      const targetVarb = this.inEntity.entityGetter(targetInfo);
      let gatherTargetVarb = true;
      for (const { switchInfo, switchValue } of inverseSwitches) {
        if (targetVarb.switchIsActive(switchInfo, switchValue)) {
          gatherTargetVarb = false;
          break;
        }
      }
      if (gatherTargetVarb) {
        this.outVarbInfoStore.push(targetInfo);
      }
    }
  }
  private relativesToFeVarbInfos(relVarbInfo: RelVarbInfo): FeVarbInfo[] {
    const varbs = this.get.varbsByFocalMixed(relVarbInfo);
    const feVarbInfos = varbs.map((varb) => varb.feVarbInfo);
    return feVarbInfos;
  }
}
