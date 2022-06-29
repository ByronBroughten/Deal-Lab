import { Obj } from "../utils/Obj";
import { SimpleSectionName } from "./baseSections";
import { GeneralRelVarbs } from "./relSectionsUtils/relVarbs";
import { VarbMeta, VarbMetaCore } from "./VarbMeta";

type VarbMetasCore = { [key: string]: VarbMeta };
export type VarbMetasRaw = { [Prop in keyof VarbMetasCore]: VarbMetaCore };

export class VarbMetas {
  constructor(readonly core: VarbMetasCore) {}
  get raw(): VarbMetasRaw {
    return Obj.keys(this.core).reduce((raw, varbName) => {
      raw[varbName] = this.core[varbName].core;
      return raw;
    }, {} as VarbMetasRaw);
  }
  getCore() {
    // this should eventually be depreciated.
    return { ...this.core };
  }
  get(varbName: keyof VarbMetasCore) {
    return this.core[varbName];
  }
  update(varbName: keyof VarbMetasCore, next: VarbMetaCore) {
    return new VarbMetas({
      ...this.core,
      [varbName]: new VarbMeta(next),
    });
  }
  get varbNames(): string[] {
    return Obj.keys(this.core) as string[];
  }
  static initFromRelVarbs(
    relVarbs: GeneralRelVarbs,
    sectionName: SimpleSectionName
  ): VarbMetas {
    const core: VarbMetasCore = {};
    for (const [varbName, relVarb] of Object.entries(relVarbs)) {
      const varbMetaCore = VarbMeta.initCore(relVarb, sectionName, varbName);
      core[varbName] = new VarbMeta(varbMetaCore);
    }
    return new VarbMetas(core);
  }
}
