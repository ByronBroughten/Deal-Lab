import { pick } from "lodash";
import { sectionContext, SimpleSectionName } from "./SectionsMeta/baseSections";
import { VarbNames } from "./SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  DescendantSectionName,
  SelfOrDescendantSectionName,
} from "./SectionsMeta/childSectionsDerived/DescendantSectionName";
import {
  inVarbInfoToOutSectionName,
  relInToOutVarbInfo,
  RelOutVarbInfo,
} from "./SectionsMeta/childSectionsDerived/RelInOutVarbInfo";
import { SectionMeta, VarbMetas } from "./SectionsMeta/SectionMeta";
import { SectionName, sectionNameS } from "./SectionsMeta/SectionName";
import {
  InUpdatePack,
  isDefaultInPack,
  isSwitchInPack,
  OutUpdatePack,
  VarbMeta,
} from "./SectionsMeta/VarbMeta";
import { Obj } from "./utils/Obj";

type SectionMetasCore = {
  [SN in SimpleSectionName]: SectionMeta<SN>;
};

export class SectionsMeta {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionsMeta.initCore();
    this.initOutUpdatePacks();
  }
  get sectionNames(): SimpleSectionName[] {
    return Obj.keys(this.core);
  }
  get<SN extends SimpleSectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionCore = this.core[sectionName];
    return sectionCore as any;
  }
  section<SN extends SimpleSectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionMeta = this.core[sectionName];
    return sectionMeta as SectionMeta<SectionName> as any;
  }
  varbs<SN extends SimpleSectionName>(sectionName: SN): VarbMetas<SN> {
    return this.get(sectionName).varbMetas;
  }
  varb<VNS extends VarbNames>(varbNames: VNS): VarbMeta<VNS["sectionName"]> {
    const { sectionName, varbName } = varbNames;
    return this.section(sectionName).varb(varbName);
  }
  value<VNS extends VarbNames>(varbNames: VNS) {
    return this.varb(varbNames).value;
  }
  selfAndDescendantNames<SN extends SectionName>(
    sectionName: SN
  ): SelfOrDescendantSectionName<SN>[] {
    const selfAndDescendantNames: SelfOrDescendantSectionName<SN>[] = [];
    const queue: SelfOrDescendantSectionName<SN>[] = [sectionName];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const descendantName = queue.shift() as DescendantSectionName<SN>;
        selfAndDescendantNames.push(descendantName);

        const { childNames } = this.section(descendantName);
        queue.push(...(childNames as DescendantSectionName<SN>[]));
      }
    }
    return selfAndDescendantNames;
  }
  makeOutUpdatePack(
    relTargetVarbInfo: RelOutVarbInfo,
    inUpdatePack: InUpdatePack
  ): OutUpdatePack {
    if (isDefaultInPack(inUpdatePack)) {
      return {
        relTargetVarbInfo,
        ...pick(inUpdatePack, ["inverseSwitches"]),
      };
    } else if (isSwitchInPack(inUpdatePack)) {
      return {
        relTargetVarbInfo,
        ...pick(inUpdatePack, ["switchInfo", "switchValue"]),
      };
    }
    throw new Error("Expected one of two InUpdatePacks.");
  }
  inUpdatePackToOuts(
    targetNames: VarbNames<SectionName<"hasVarb">>,
    inUpdatePack: InUpdatePack
  ): void {
    const { inUpdateInfos } = inUpdatePack;
    for (const inVarbInfo of inUpdateInfos) {
      const outInfo = relInToOutVarbInfo({
        namesOfVarbWithInVarb: targetNames,
        inVarbInfo,
      });
      const outUpdatePack = this.makeOutUpdatePack(outInfo, inUpdatePack);
      const { varbName } = inVarbInfo;
      const sectionName = inVarbInfoToOutSectionName({
        sectionNameWithInVarb: targetNames.sectionName,
        inVarbInfo,
      });
      const inVarbMeta = this.varb({ sectionName, varbName });
      const sectionMeta = this.section(sectionName);
      (this.core[sectionName] as SectionMeta<any>) =
        sectionMeta.depreciatingUpdateVarbMeta(
          new VarbMeta({
            ...inVarbMeta.core,
            outUpdatePacks: inVarbMeta.outUpdatePacks.concat([outUpdatePack]),
          })
        );
    }
  }
  initOutUpdatePacks() {
    for (const [sectionName, sectionMeta] of Obj.entriesFull(this.core)) {
      if (!sectionNameS.is(sectionName, "hasVarb")) continue;
      for (const [varbName, varbMeta] of Obj.entriesFull(
        (sectionMeta as SectionMeta<SectionName>).varbMetas
      )) {
        for (const inUpdatePack of varbMeta.inUpdatePacks) {
          this.inUpdatePackToOuts(
            { sectionName, varbName, sectionContext } as any,
            inUpdatePack
          );
        }
      }
    }
  }

  private static initCore(): SectionMetasCore {
    const sectionNames = sectionNameS.arrs.all;
    return sectionNames.reduce((core, sectionName) => {
      (core[sectionName] as SectionMeta<typeof sectionName>) =
        SectionMeta.init(sectionName);
      return core;
    }, {} as SectionMetasCore);
  }
}

export const sectionsMeta = new SectionsMeta();
