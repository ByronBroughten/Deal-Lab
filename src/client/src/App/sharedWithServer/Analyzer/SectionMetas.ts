import { omit, pick } from "lodash";
import { Obj, ObjectEntries } from "../utils/Obj";
import { relSections, RelSectionsTemplate } from "./SectionMetas/relSections";
import {
  OutRelVarbInfo,
  VarbNames,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import { GeneralRelVarbs } from "./SectionMetas/relSections/rel/relVarbs";
import {
  RelSections,
  sectionToParentArr,
  SectionToParentsOrNeverArr,
  ParentName,
} from "./SectionMetas/relSectionTypes";
import {
  InUpdatePack,
  isDefaultInPack,
  isSwitchInPack,
  OutUpdatePack,
  VarbMeta,
  VarbMetaCore,
} from "./SectionMetas/VarbMeta";
import { SectionNam, SectionName } from "./SectionMetas/SectionName";
import { Relative } from "./SectionMetas/relSections/baseInfo";

type VarbMetasCore = { [key: string]: VarbMeta };
type VarbMetasRaw = { [Prop in keyof VarbMetasCore]: VarbMetaCore };

class VarbMetas {
  constructor(private core: VarbMetasCore) {}
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
  static initFromPreVarbs(
    relVarbs: GeneralRelVarbs,
    sectionName: SectionName
  ): VarbMetas {
    const core: VarbMetasCore = {};
    for (const [varbName, relVarb] of Object.entries(relVarbs)) {
      const varbMetaCore = VarbMeta.initCore(relVarb, sectionName, varbName);
      core[varbName] = new VarbMeta(varbMetaCore);
    }
    return new VarbMetas(core);
  }
}

export type SectionMeta<S extends SectionName> = Omit<
  RelSections[S],
  "relVarbs"
> & {
  sectionName: S;
  varbMetas: VarbMetas;
  parents: SectionToParentsOrNeverArr[S];
};

type SectionMetasCore = {
  [S in SectionName]: SectionMeta<S>;
};

type SectionMetasRaw = {
  [S in SectionName]: Omit<SectionMetasCore[S], "varbMetas"> & {
    varbMetas: VarbMetasRaw;
  };
};

export class SectionMetas {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionMetas.initCore();
    this.initOutUpdatePacks();
  }

  get raw() {
    // to get this to work, I need sectionMeta to be its own thing and
    // to work properly.
    return Obj.keys(this.core).reduce((raw, sectionName) => {
      raw[sectionName] = {
        ...omit(this.core[sectionName], ["varbMetas"]),
        // @ts-ignore
        varbMetas: this.core[sectionName].varbMetas.raw,
      };
      return raw;
    }, {} as SectionMetasRaw);
  }
  get<S extends SectionName>(sectionName: S): SectionMeta<S> {
    return this.core[sectionName] as any as SectionMeta<S>;
  }
  varbNames(sectionName: SectionName): string[] {
    return this.varbMetas(sectionName).varbNames;
  }

  parentName<S extends SectionName<"hasOneParent">>(
    sectionName: S
  ): ParentName<S> {
    const meta = sectionMetas.get(sectionName);
    return meta.parents[0] as ParentName<S>;
  }

  varbMeta(varbNames: VarbNames<SectionName>): VarbMeta {
    const { sectionName, varbName } = varbNames;
    const varbMeta = this.core[sectionName].varbMetas.get(varbName);
    if (!varbMeta) {
      throw new Error(`No varbMeta at ${sectionName}.${varbName}`);
    } else return varbMeta;
  }
  varbMetas(sectionName: SectionName): VarbMetas {
    return this.core[sectionName].varbMetas;
  }

  private inToOutRelative(
    focalSectionName: SectionName,
    inRelative: Relative<"inVarb">
  ): Relative<"outVarb"> {
    const focalFrame = relSections[focalSectionName];
    const childSpecifiers = ["children"] as const;
    if (inRelative === "local") return "local";
    else if (childSpecifiers.includes(inRelative as any)) return "parent";
    else if (inRelative === "static") {
      if (focalFrame.alwaysOne) return "static";
      else return "all";
    } else if (inRelative === "all") {
      if (focalFrame.alwaysOne) return "static";
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
      const outUpdatePack = this.makeOutUpdatePack(
        {
          ...targetNames,
          id: this.inToOutRelative(targetNames.sectionName, id),
          idType: "relative",
        },
        inUpdatePack
      );

      const inVarbMeta = this.varbMeta({ sectionName, varbName });
      const { varbMetas } = this.core[sectionName];

      this.core[sectionName].varbMetas = varbMetas.update(varbName, {
        ...inVarbMeta.core,
        outUpdatePacks: inVarbMeta.outUpdatePacks.concat([outUpdatePack]),
      });
    }
  }

  initOutUpdatePacks() {
    for (const [sectionName, sectionMeta] of ObjectEntries(this.core)) {
      if (!SectionNam.is(sectionName, "hasVarb")) continue;
      for (const [varbName, varbMeta] of ObjectEntries(
        sectionMeta.varbMetas.getCore()
      )) {
        for (const inUpdatePack of varbMeta.inUpdatePacks) {
          this.inUpdatePackToOuts({ sectionName, varbName }, inUpdatePack);
        }
      }
    }
  }

  private static initSectionMeta<S extends SectionName>(
    sectionName: S
  ): SectionMeta<S> {
    const relSection: RelSectionsTemplate[keyof RelSectionsTemplate] =
      relSections[sectionName];

    const sectionMeta = {
      sectionName,
      ...omit(relSection, ["relVarbs"]),
      varbMetas: VarbMetas.initFromPreVarbs(
        relSections[sectionName].relVarbs,
        sectionName
      ),
      parents: sectionToParentArr[sectionName],
    } as SectionMeta<S>;

    return sectionMeta;
  }
  private static initCore(): SectionMetasCore {
    // I must initialize the parents before the children
    // in order to instantiate information about varb update order.
    const core: Partial<SectionMetasCore> = {
      main: this.initSectionMeta("main"),
    };
    for (const relSection of Object.values(relSections)) {
      for (const sectionName of relSection.childSectionNames) {
        core[sectionName] = this.initSectionMeta(sectionName) as any;
      }
    }
    return core as SectionMetasCore;
  }
}

export const sectionMetas = new SectionMetas();
