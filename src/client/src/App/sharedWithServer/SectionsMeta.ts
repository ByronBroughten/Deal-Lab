import { pick } from "lodash";
import { sectionContext, SimpleSectionName } from "./SectionsMeta/baseSections";
import { RelativeIds } from "./SectionsMeta/baseSections/id";
import {
  OutRelVarbInfo,
  VarbNames,
} from "./SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  DescendantType,
  SelfOrDescendantType,
} from "./SectionsMeta/relSectionTypes/ChildTypes";
import { SectionMeta } from "./SectionsMeta/SectionMeta";
import { SectionName, sectionNameS } from "./SectionsMeta/SectionName";
import {
  InUpdatePack,
  isDefaultInPack,
  isSwitchInPack,
  OutUpdatePack,
  VarbMeta,
} from "./SectionsMeta/VarbMeta";
import { VarbMetas } from "./SectionsMeta/VarbMetas";
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
  varbs<SN extends SimpleSectionName>(sectionName: SN): VarbMetas {
    return this.get(sectionName).varbMetas;
  }
  varb<VNS extends VarbNames>(varbNames: VNS): VarbMeta {
    const { sectionName, varbName } = varbNames;
    const varbMetas = this.varbs(sectionName);
    const varbMeta = varbMetas.get(varbName);
    if (!varbMeta) {
      throw new Error(`No varbMeta at ${sectionName}.${varbName}`);
    } else return varbMeta;
  }
  value<VNS extends VarbNames>(varbNames: VNS) {
    return this.varb(varbNames).value;
  }
  varbNames<SN extends SimpleSectionName>(sectionName: SN): string[] {
    return this.varbs(sectionName).varbNames;
  }
  selfAndDescendantNames<SN extends SectionName>(
    sectionName: SN
  ): SelfOrDescendantType<SN>[] {
    const selfAndDescendantNames: SelfOrDescendantType<SN>[] = [];
    const queue: SelfOrDescendantType<SN>[] = [sectionName];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const descendantName = queue.shift() as DescendantType<SN>;
        selfAndDescendantNames.push(descendantName);

        const { childNames } = this.section(descendantName);
        queue.push(...(childNames as DescendantType<SN>[]));
      }
    }
    return selfAndDescendantNames;
  }
  private inToOutRelative<SN extends SimpleSectionName>(
    focalSectionName: SN,
    inRelative: RelativeIds["inVarb"]
  ): RelativeIds["outVarb"] {
    const focalSectionMeta = this.section(focalSectionName);
    if (inRelative === "local") return "local";
    else if (inRelative === "children") return "parent";
    else if (inRelative === "static") {
      if (focalSectionMeta.alwaysOne) return "static";
      else return "all";
    } else if (inRelative === "all") {
      if (focalSectionMeta.alwaysOne) return "static";
      // only static variables should have inRelatives of "all"
    }
    throw new Error(`Relative '${inRelative}' is not valid.`);
  }
  makeOutUpdatePack(
    relTargetVarbInfo: OutRelVarbInfo,
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
    for (const info of inUpdateInfos) {
      const { sectionName, varbName, id } = info;

      // the issue may be that there is no such thing as a permanet
      // outUpdatePack when a section can have two parents.
      const outUpdatePack = this.makeOutUpdatePack(
        {
          ...targetNames,
          id: this.inToOutRelative(targetNames.sectionName, id),
          idType: "relative",
        },
        inUpdatePack
      );

      const inVarbMeta = this.varb({ sectionName, varbName });
      const varbMetas = this.varbs(sectionName);
      const sectionMeta = this.section(sectionName);
      this.core[sectionName] = sectionMeta.depreciatingUpdateVarbMetas(
        varbMetas.update(varbName, {
          ...inVarbMeta.core,
          outUpdatePacks: inVarbMeta.outUpdatePacks.concat([outUpdatePack]),
        })
      ) as any;
    }
  }
  initOutUpdatePacks() {
    for (const [sectionName, sectionMeta] of Obj.entriesFull(this.core)) {
      if (!sectionNameS.is(sectionName, "hasVarb")) continue;
      for (const [varbName, varbMeta] of Obj.entriesFull(
        (sectionMeta as SectionMeta<SectionName>).varbMetas.getCore()
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
