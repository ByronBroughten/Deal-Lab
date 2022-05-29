import { pick } from "lodash";
import { Id } from "../SectionsMeta/baseSections/id";
import { FeParentInfo } from "../SectionsMeta/Info";
import {
  ChildIdArrsWide,
  SelfOrDescendantName,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { StrictOmit, StrictPick } from "../utils/types";
import { AddSectionPropsNext } from "./methods/internal/addSections/addSectionsTypes";
import { SectionPackRaw } from "./SectionPackRaw";
import { DbVarbs, RawSection, RawSections } from "./SectionPackRaw/RawSection";
import { DbSectionInfo } from "./SectionPackRaw/RawSectionFinder";

export class FeSectionPackNext<SN extends SectionName> {
  constructor(readonly core: SectionPackRaw<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get headSectionFinder(): DbSectionInfo<SN> {
    return {
      sectionName: this.sectionName,
      dbId: this.dbId,
    };
  }
  private get rawSections(): RawSections<SN> {
    return this.core.rawSections;
  }
  resetHeadDbId() {
    const rawSection = this.rawSection(this.headSectionFinder);
    const nextDbId = Id.make();
    rawSection.dbId = nextDbId;
    this.core.dbId = nextDbId;
  }
  static resetDbId<SN extends SectionName>(
    pack: SectionPackRaw<SN>
  ): SectionPackRaw<SN> {
    const fePack = new FeSectionPackNext(pack);
    fePack.resetHeadDbId();
    return fePack.core;
  }
  private dbToFeIds<SN extends SectionName>(
    childDbIds: ChildIdArrsWide<SN>
  ): ChildIdArrsWide<SN> {
    return Obj.entries(childDbIds).reduce(
      (childFeIds, [childName, dbIdArr]) => {
        (childFeIds[childName] as string[]) = dbIdArr.map(() => Id.make());
        return childFeIds;
      },
      {} as ChildIdArrsWide<SN>
    );
  }
  static makeOrderedPreSections<SN extends SectionName>({
    sectionPack,
    sectionPackContext,
  }: MakeOrderedPreSectionsProps<SN>): FeSelfOrDescendantNodeNext<SN>[] {
    const fePack = new FeSectionPackNext(sectionPack);
    return fePack.makeOrderedPreSections(sectionPackContext);
  }
  makeOrderedPreSections(
    props: SectionPackContext<SN>
  ): FeSelfOrDescendantNodeNext<SN>[] {
    const orderedPreSections: FeSelfOrDescendantNodeNext<SN>[] = [];
    const rawSectionParents: SectionNodeMakerNext<SN>[] = [];
    rawSectionParents.push(this.makeHeadNodeMaker(props));
    while (rawSectionParents.length > 0) {
      const queueLength = rawSectionParents.length;
      for (let i = 0; i < queueLength; i++) {
        const nodeMaker = rawSectionParents.shift() as SectionNodeMakerNext<
          SelfOrDescendantName<SN>
        >;
        const feNode = this.makeFeNodeNext(nodeMaker);
        orderedPreSections.push(feNode);

        const rawSectionParent = this.makeRawSectionParentNext(feNode);
        rawSectionParents.push(...this.makeNodeMakers(rawSectionParent));
      }
    }
    return orderedPreSections;
  }
  private makeHeadNodeMaker({ feId, ...rest }: SectionPackContext<SN>) {
    return {
      feId: feId ?? Id.make(),
      dbId: this.dbId,
      sectionName: this.sectionName,
      ...rest,
    } as SectionNodeMakerNext<SN>;
  }
  private makeFeNodeNext<DN extends SelfOrDescendantName<SN>>(
    nodeMaker: SectionNodeMakerNext<DN>
  ): SectionNodeNext<DN> {
    const { dbVarbs, childDbIds } = this.rawSection(nodeMaker);
    return {
      ...nodeMaker,
      dbVarbs,
      childFeIds: this.dbToFeIds(childDbIds as ChildIdArrsWide<DN>),
    } as SectionNodeNext<DN>;
  }
  private rawSection<DN extends SelfOrDescendantName<SN>>({
    sectionName,
    dbId,
  }: DbSectionInfo<DN>): RawSection<DN> {
    const rawSections = this.rawSections[sectionName];
    const rawSection = rawSections.find(
      (rawSection) => rawSection.dbId === dbId
    );
    if (rawSection) return rawSection as any;
    else throw new Error(`No rawSection found at ${sectionName}.${dbId}`);
  }
  private makeRawSectionParentNext<DN extends SelfOrDescendantName<SN>>(
    feNode: SectionNodeNext<DN>
  ): RawSectionParent<DN> {
    const { childDbIds } = this.rawSection(feNode);
    return {
      parentInfo: pick(feNode, ["sectionName", "feId"]),
      childDbIds,
      childFeIds: feNode.childFeIds,
    } as RawSectionParent<DN>;
  }
  private makeNodeMakers<DN extends SelfOrDescendantName<SN>>({
    parentInfo,
    childDbIds,
    childFeIds,
  }: RawSectionParent<DN>): SectionNodeMakerNext<SN>[] {
    const sectionNodeMakers: SectionNodeMakerNext<SN>[] = [];
    for (const [sectionName, dbIds] of Obj.entries(childDbIds)) {
      const feIds = childFeIds[sectionName];
      dbIds.forEach((dbId, idx) => {
        sectionNodeMakers.push({
          sectionName,
          parentInfo,
          dbId,
          feId: feIds[idx],
        } as SectionNodeMakerNext<SN>);
      });
    }
    return sectionNodeMakers;
  }
}

type MakeOrderedPreSectionsProps<SN extends SectionName> = {
  sectionPack: SectionPackRaw<SN>;
  sectionPackContext: SectionPackContext<SN>;
};

type RawSectionParent<SN extends SectionName = SectionName> = {
  parentInfo: FeParentInfo<SN>;
  childFeIds: ChildIdArrsWide<SN>;
  childDbIds: ChildIdArrsWide<SN>;
};

type FeSelfOrDescendantNodeNext<SN extends SectionName> = SectionNodeNext<
  SelfOrDescendantName<SN>
>;
interface SectionNodeNext<SN extends SectionName>
  extends StrictOmit<AddSectionPropsNext<SN>, "childFeIds"> {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId: string;
  dbId: string;
  childFeIds: ChildIdArrsWide<SN>;
  dbVarbs: DbVarbs;
  idx?: number;
}

interface SectionNodeMakerNext<SN extends SectionName>
  extends StrictPick<
    SectionNodeNext<SN>,
    "sectionName" | "parentInfo" | "dbId" | "feId" | "idx"
  > {}

export interface SectionPackContext<SN extends SectionName>
  extends StrictPick<AddSectionPropsNext<SN>, "parentInfo" | "feId" | "idx"> {
  parentInfo: FeParentInfo<SN>;
  feId?: string;
  idx?: number;
}
