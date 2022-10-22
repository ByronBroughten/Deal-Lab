import { RelVarbInfo } from "../SectionsMeta/childSectionsDerived/RelVarbInfo";
import { FeVarbInfo } from "../SectionsMeta/Info";
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
  private getterSections = new GetterSections(this.getterSectionsProps);
  get outVarbInfos() {
    this.gatherOutVarbInfos();
    return this.outVarbInfoStore;
  }
  get outVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.outVarbInfos);
  }
  private gatherOutVarbInfos() {
    this.outVarbInfoStore = [];
    this.gatherOutEntities();
    this.gatherOutRelatives();
  }
  private gatherOutEntities() {
    const { outEntities } = this.get;
    const feOutEntities = outEntities.map((outEntity) => {
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
      const targetVarb = this.get.getterVarb(targetInfo);
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
      const targetVarb = this.get.getterVarb(targetInfo);
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
