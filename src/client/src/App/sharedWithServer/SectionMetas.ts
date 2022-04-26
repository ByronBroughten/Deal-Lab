import { isEqual, pick } from "lodash";
import {
  baseSections,
  BaseSections,
  ContextName,
  sectionContext,
  SimpleSectionName,
} from "./SectionMetas/baseSections";
import { RelativeIds } from "./SectionMetas/baseSections/id";
import { relSections, RelSections } from "./SectionMetas/relSections";
import {
  OutRelVarbInfo,
  SimpleVarbNames,
  VarbNames,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  DescendantName,
  SectionNameWithSameChildren,
  SelfOrDescendantName,
} from "./SectionMetas/relSectionTypes/ChildTypes";
import {
  makeSectionToParentArrs,
  ParentName,
  SectionToParentArrs,
} from "./SectionMetas/relSectionTypes/ParentTypes";
import { NextSectionMeta, SectionMetaCore } from "./SectionMetas/SectionMeta";
import { SectionName, sectionNameS } from "./SectionMetas/SectionName";
import {
  InUpdatePack,
  isDefaultInPack,
  isSwitchInPack,
  OutUpdatePack,
  VarbMeta,
} from "./SectionMetas/VarbMeta";
import { VarbMetas, VarbMetasRaw } from "./SectionMetas/VarbMetas";
import { NextObjEntries, Obj } from "./utils/Obj";
import { MergeUnionObj } from "./utils/types/mergeUnionObj";

type BaseSection<
  SN extends SimpleSectionName<CN>,
  CN extends ContextName = "fe"
> = MergeUnionObj<BaseSections[CN][SN]>;

type RelSection<
  SN extends SimpleSectionName<CN>,
  CN extends ContextName = "fe"
> = MergeUnionObj<RelSections[CN][SN]>;

export type SectionMeta<
  SN extends SimpleSectionName<CN>,
  CN extends ContextName = "fe"
> = RelSection<SN, CN> &
  BaseSection<SN, CN> & {
    varbMetas: VarbMetas;
    parents: SectionToParentArrs<CN>[SN];
  };
// an intermediary type like mergeUnionObj may make things worse

// export type SectionMeta<
//   SN extends SimpleSectionName<CN>,
//   CN extends ContextName = "fe"
// > = RelSections[CN][SN & keyof RelSections[CN]] &
//   BaseSections[CN][SN] & {
//     varbMetas: VarbMetas;
//     parents: SectionToParentArrs<CN>[SN];
//   };

type SectionMetasCore = {
  [CN in ContextName]: {
    [SN in SimpleSectionName<CN>]: NextSectionMeta<CN, SN>;
  };
};
type SectionMetasRaw = {
  [SC in ContextName]: {
    [SN in SimpleSectionName<SC>]: Omit<
      SectionMetasCore[SC][SN & keyof SectionMetasCore[SC]],
      "varbMetas"
    > & {
      varbMetas: VarbMetasRaw;
    };
  };
};

export class SectionMetas {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionMetas.initCore();
    this.initOutUpdatePacks();
  }
  isDbSectionNameWithSameChildren<SN extends SimpleSectionName>(
    sectionName: SN,
    testSectionName: SimpleSectionName
  ): testSectionName is SectionNameWithSameChildren<SN, "fe", "db"> {
    const sectionParentNames = this.section(sectionName).get("parents");
    const otherParentNames = this.section(testSectionName, "db").get("parents");
    return isEqual(sectionParentNames, otherParentNames);
  }
  isFeSectionNameWithSameChildren<SN extends SimpleSectionName>(
    sectionName: SN,
    testSectionName: SimpleSectionName
  ): testSectionName is SectionNameWithSameChildren<SN, "fe", "fe"> {
    const sectionParentNames = this.section(sectionName).get("parents");
    const otherParentNames = this.section(testSectionName).get("parents");
    return isEqual(sectionParentNames, otherParentNames);
  }

  get raw() {
    const rawSectionMetas = sectionContext.makeBlankContextObj();
    for (const contextName of Obj.keys(this.core)) {
      for (const sectionName of Obj.keys(this.core[contextName])) {
        rawSectionMetas[contextName][sectionName] = {
          ...this.core[contextName][sectionName],
          varbMetas: this.varbs(sectionName, contextName).raw,
        };
      }
    }
    return rawSectionMetas as SectionMetasRaw;
  }
  get<SN extends SimpleSectionName<CN>, CN extends ContextName = "fe">(
    sectionName: SN,
    sectionContext?: CN
  ): NextSectionMeta<CN, SN> {
    const contextCore = this.core[(sectionContext ?? "fe") as CN];
    const sectionCore = contextCore[sectionName as keyof typeof contextCore];
    return sectionCore as any;
  }
  context<CN extends ContextName>(contextName: CN): SectionMetasCore[CN] {
    return this.core[contextName];
  }
  section<SN extends SimpleSectionName<CN>, CN extends ContextName = "fe">(
    sectionName: SN,
    contextName?: CN
  ): NextSectionMeta<CN, SN> {
    const contextCore = this.context((contextName ?? "fe") as CN);
    const sectionMeta = contextCore[sectionName];
    return sectionMeta as NextSectionMeta<ContextName, SectionName> as any;
  }
  varbs<SN extends SimpleSectionName<SC>, SC extends ContextName = "fe">(
    sectionName: SN,
    sectionContext?: SC
  ): VarbMetas {
    return this.get(sectionName, sectionContext ?? ("fe" as SC)).get(
      "varbMetas"
    );
  }
  varb<VNS extends SimpleVarbNames, CN extends ContextName = "fe">(
    varbNames: VNS,
    contextName?: CN
  ): VarbMeta {
    const { sectionName, varbName } = varbNames;
    const varbMetas = this.varbs(sectionName, (contextName ?? "fe") as CN);
    const varbMeta = varbMetas.get(varbName);
    if (!varbMeta) {
      throw new Error(`No varbMeta at ${sectionName}.${varbName}`);
    } else return varbMeta;
  }
  value<VNS extends SimpleVarbNames, CN extends ContextName = "fe">(
    varbNames: VNS,
    contextName?: CN
  ) {
    return this.varb(varbNames, contextName).value;
  }
  varbNames<SN extends SimpleSectionName<CN>, CN extends ContextName = "fe">(
    sectionName: SN,
    sectionContext: CN
  ): string[] {
    return this.varbs(sectionName, sectionContext).varbNames;
  }
  parentName<
    SN extends SectionName<"hasOneParent", CN>,
    CN extends ContextName = "fe"
  >(sectionName: SN, sectionContext?: CN): ParentName<SN, CN> {
    const sectionMeta = this.section(
      sectionName,
      (sectionContext ?? "fe") as CN
    );
    return sectionMeta.get("parents")[0] as ParentName<SN, CN>;
  }
  selfAndDescendantNames<SN extends SectionName, CN extends ContextName>(
    sectionName: SN,
    contextName: CN
  ): SelfOrDescendantName<SN, CN>[] {
    const selfAndDescendantNames: SelfOrDescendantName<SN, CN>[] = [];
    const queue: SelfOrDescendantName<SN, CN>[] = [sectionName];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const descendantName = queue.shift() as DescendantName<SN, CN>;
        selfAndDescendantNames.push(descendantName);

        const { childNames } = this.section(descendantName, contextName)
          .core as SectionMetaCore<"fe", SN>;
        queue.push(...(childNames as DescendantName<SN, CN>[]));
      }
    }
    return selfAndDescendantNames;
  }

  private inToOutRelative<
    CN extends ContextName,
    SN extends SimpleSectionName<CN>
  >(
    focalSectionName: SN,
    inRelative: RelativeIds["inVarb"],
    contextName: CN
  ): RelativeIds["outVarb"] {
    const focalSectionMeta = this.get(focalSectionName, contextName);
    const childSpecifiers = ["children"] as const;
    if (inRelative === "local") return "local";
    else if (childSpecifiers.includes(inRelative as any)) return "parent";
    else if (inRelative === "static") {
      if (focalSectionMeta.get("alwaysOne")) return "static";
      else return "all";
    } else if (inRelative === "all") {
      if (focalSectionMeta.get("alwaysOne")) return "static";
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
    const { sectionContext } = targetNames;

    for (const info of inUpdateInfos) {
      const { sectionName, varbName, id } = info;
      const outUpdatePack = this.makeOutUpdatePack(
        {
          ...targetNames,
          id: this.inToOutRelative(targetNames.sectionName, id, sectionContext),
          idType: "relative",
        },
        inUpdatePack
      );

      const inVarbMeta = this.varb({ sectionName, varbName }, sectionContext);
      const varbMetas = this.varbs(sectionName, sectionContext);
      const sectionMeta = this.section(sectionName, sectionContext);
      this.core[sectionContext][sectionName] =
        sectionMeta.depreciatingUpdateVarbMetas(
          varbMetas.update(varbName, {
            ...inVarbMeta.core,
            outUpdatePacks: inVarbMeta.outUpdatePacks.concat([outUpdatePack]),
          })
        ) as any;
    }
  }
  initOutUpdatePacks() {
    for (const [sectionContext, dbFeSections] of NextObjEntries(this.core)) {
      for (const [sectionName, sectionMeta] of NextObjEntries(dbFeSections)) {
        if (!sectionNameS.is(sectionName, "hasVarb")) continue;
        for (const [varbName, varbMeta] of NextObjEntries(
          (sectionMeta as NextSectionMeta<ContextName, SectionName>)
            .get("varbMetas")
            .getCore()
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
  }
  private static initSectionMeta<
    CN extends ContextName,
    SN extends SimpleSectionName<CN>,
    PA extends SectionToParentArrs<CN>[SN]
  >(
    sectionContext: CN,
    sectionName: SN,
    parentNameArr: PA
  ): NextSectionMeta<CN, SN> {
    const relSection = relSections[sectionContext][sectionName];
    const baseSection = baseSections[sectionContext][sectionName];
    return new NextSectionMeta({
      ...relSection,
      ...baseSection,
      varbMetas: VarbMetas.initFromRelVarbs(relSection.relVarbs, sectionName),
      parents: parentNameArr,
    });
  }
  private static initCore(): SectionMetasCore {
    const partial: { [SC in ContextName]: any } = {
      fe: {},
      db: {},
    };
    const contextSectionToParentArrs = makeSectionToParentArrs();
    for (const [sectionContext, relContextSections] of Obj.entries(
      relSections
    )) {
      const sectionToParentArrs = contextSectionToParentArrs[sectionContext];
      partial[sectionContext]["main"] = this.initSectionMeta(
        sectionContext,
        "main",
        sectionToParentArrs["main"]
      );
      for (const sectionName of Obj.keys(relContextSections)) {
        partial[sectionContext][sectionName] = this.initSectionMeta(
          sectionContext,
          sectionName,
          sectionToParentArrs[sectionName]
        );
      }
    }

    return partial as SectionMetasCore;
  }
}

export const sectionMetas = new SectionMetas();
