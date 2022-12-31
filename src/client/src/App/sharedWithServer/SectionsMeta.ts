import { VarbNames } from "./SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  DescendantSectionName,
  SelfOrDescendantSectionName,
} from "./SectionsMeta/sectionChildrenDerived/DescendantSectionName";
import { SectionMeta, VarbMetas } from "./SectionsMeta/SectionMeta";
import { SectionName, sectionNames } from "./SectionsMeta/SectionName";
import { SectionNameByType } from "./SectionsMeta/SectionNameByType";
import { VarbMeta } from "./SectionsMeta/VarbMeta";
import { Obj } from "./utils/Obj";

type SectionMetasCore = {
  [SN in SectionName]: SectionMeta<SN>;
};

export class SectionsMeta {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionsMeta.initCore();
  }
  get sectionNames(): SectionName[] {
    return Obj.keys(this.core);
  }
  get<SN extends SectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionCore = this.core[sectionName];
    return sectionCore as any;
  }
  section<SN extends SectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionMeta = this.core[sectionName];
    if (sectionMeta === undefined) {
      throw new Error(`No section with of sectionName ${sectionName}`);
    }
    return sectionMeta as SectionMeta<SectionNameByType> as any;
  }
  varbs<SN extends SectionName>(sectionName: SN): VarbMetas<SN> {
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
  private static initCore(): SectionMetasCore {
    return sectionNames.reduce((core, sectionName) => {
      (core[sectionName] as SectionMeta<typeof sectionName>) =
        SectionMeta.init(sectionName);
      return core;
    }, {} as SectionMetasCore);
  }
}

export const sectionsMeta = new SectionsMeta();
