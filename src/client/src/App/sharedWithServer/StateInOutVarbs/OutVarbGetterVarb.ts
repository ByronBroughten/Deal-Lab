import { RelVarbInfo } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { VarbInfo } from "../SectionsMeta/Info";
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
  SN extends SectionName<"hasVarb"> = SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private outVarbInfoStore: VarbInfo[];
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
      const varb = this.getterSections.varbByMixed(outEntity);
      return varb.feVarbInfo;
    });
    this.outVarbInfoStore.push(...feOutEntities);
  }

  get outUpdatePacks() {
    const { outUpdatePacks } = this.get.meta;
    return outUpdatePacks.filter(({ relTargetVarbInfo }) => {
      const { id, sectionName } = relTargetVarbInfo;

      if (id === "parent") {
        if (sectionName === this.get.section.parentName) return true;
        else return false;
      }
      if (id === "local") return true;
      if (id === "all" || id === "static") return true;
      // phasing out

      throw new Error(`id "${id}" is not accounted for here.`);
    });
  }
  private gatherOutRelatives() {
    for (const outUpdatePack of this.outUpdatePacks) {
      if (VarbMeta.isSwitchOutPack(outUpdatePack)) {
        this.gatherFromSwitchUpdatePack(outUpdatePack);
      } else {
        // 1: If something tries update a parentVarb
        // but doesn't have a parent with that varb
        // throw an error

        // 2: Figure out why the outUpdatePacks are trying
        // to reference all possible parents.

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
