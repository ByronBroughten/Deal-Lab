import { VarbNames } from "./SectionsMeta/SectionInfo/VarbInfoBase";
import { SectionMeta, VarbMetas } from "./SectionsMeta/SectionMeta";
import { SectionName, sectionNames } from "./SectionsMeta/SectionName";
import { ValueMeta } from "./SectionsMeta/values/valueMetaGeneric";
import { valueMetas } from "./SectionsMeta/values/valueMetas";
import { ValueName } from "./SectionsMeta/values/ValueName";
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
      throw new Error(`No section with sectionName "${sectionName}"`);
    }
    return sectionMeta as SectionMeta<any> as any;
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
  valueByName<VN extends ValueName>(valueName: VN): ValueMeta<VN> {
    return valueMetas[valueName] as ValueMeta<VN>;
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
