import { VarbInfo } from "../SectionsMeta/Info";
import { RelVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
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
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private outVarbInfoStore: VarbInfo[];
  constructor(props: GetterVarbProps<SN>) {
    super(props);
    this.outVarbInfoStore = [];
  }
  get = new GetterVarb(this.getterVarbProps);
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
      const varb = this.getterSections.varbByMixed(outEntity);
      return varb.feVarbInfo;
    });
    this.outVarbInfoStore.push(...feOutEntities);
  }
  private gatherOutRelatives() {
    const { outUpdatePacks } = this.get.meta;
    for (const outUpdatePack of outUpdatePacks) {
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
    const targetVarbInfos = this.relativesToFeVarbInfos(relTargetVarbInfo);
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
    const targetVarbInfos = this.relativesToFeVarbInfos(relTargetVarbInfo);
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
  private relativesToFeVarbInfos<SN extends SectionName<"hasVarb">>(
    relVarbInfo: RelVarbInfo<SN>
  ): VarbInfo<SN>[] {
    const varbs = this.get.varbsByFocalMixed(relVarbInfo);
    const feVarbInfos = varbs.map((varb) => varb.feVarbInfo);
    return feVarbInfos;
  }
}
