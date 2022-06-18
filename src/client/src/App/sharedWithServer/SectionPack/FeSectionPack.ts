import { extend } from "lodash";
import { Id } from "../SectionsMeta/baseSections/id";
import { InfoS } from "../SectionsMeta/Info";
import { SelfAndDescendantIds } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { RawSectionFinder } from "./DbSectionInfo";
import { FeSelfOrDescendantParentStub } from "./FeSectionPacks/FeParentStub";
import {
  FeSelfOrDescendantNode,
  OneSectionNodeMaker,
  SectionNodeMaker,
} from "./FeSectionPacks/FeSectionNode";
import { GeneralRawSection, RawSection, RawSections } from "./RawSection";
import { SectionPackRaw } from "./SectionPackRaw";
export type SectionPackSupplements<SN extends SectionName> = {
  parentInfo: ParentFeInfo<SN>;
  feId?: string;
  idx?: number;
};

type FeSectionPackCore<SN extends SectionName> = SectionPackRaw<SN>;
export class FeSectionPack<SN extends SectionName> {
  constructor(readonly core: FeSectionPackCore<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get rawSections(): RawSections<SN> {
    return this.core.rawSections;
  }
  get headSectionFinder() {
    return {
      sectionName: this.sectionName,
      dbId: this.dbId,
    } as RawSectionFinder<SN, "fe">;
  }
  rawSection({
    sectionName,
    dbId,
  }: RawSectionFinder<SN, "fe">): RawSection<SN> {
    const rawSections = this.rawSections[
      sectionName
    ] as any as GeneralRawSection[];
    const rawSection = rawSections.find(
      (rawSection) => rawSection.dbId === dbId
    );
    if (rawSection) return rawSection as any;
    else throw new Error(`No rawSection found at ${sectionName}.${dbId}`);
  }
  get headSection(): RawSection<SN> {
    return this.rawSection(this.headSectionFinder);
  }
  dbToFeIds(childDbIds: SelfAndDescendantIds<SN>): SelfAndDescendantIds<SN> {
    return Obj.entries(childDbIds as SelfAndDescendantIds).reduce(
      (childFeIds, [childName, dbIdArr]) => {
        (childFeIds[childName] as string[]) = dbIdArr.map(() => Id.make());
        return childFeIds;
      },
      {} as SelfAndDescendantIds
    ) as SelfAndDescendantIds<SN>;
  }
  makeFeNode(nodeMaker: SectionNodeMaker<SN>): FeSelfOrDescendantNode<SN> {
    const { dbVarbs, childDbIds } = this.rawSection(
      nodeMaker as RawSectionFinder<SN>
    );
    return extend(nodeMaker, {
      dbVarbs,
      childFeIds: this.dbToFeIds(childDbIds as SelfAndDescendantIds<SN>),
    }) as any;
  }
  makeParentStub(
    feNode: FeSelfOrDescendantNode<SN>
  ): FeSelfOrDescendantParentStub<SN> {
    const { childDbIds } = this.rawSection(
      feNode as any as RawSectionFinder<SN>
    );
    return {
      parentInfo: InfoS.fe(feNode.sectionName, feNode.feId),
      childDbIds,
      childFeIds: feNode.childFeIds,
    } as FeSelfOrDescendantParentStub<SN>;
  }
  makeHeadNodeMaker({ feId, ...rest }: SectionPackSupplements<SN>) {
    return {
      feId: feId ?? Id.make(),
      dbId: this.dbId,
      sectionName: this.sectionName,
      ...rest,
    } as SectionNodeMaker<SN>;
  }
  makeNodeMakers({
    parentInfo,
    childDbIds,
    childFeIds,
  }: FeSelfOrDescendantParentStub<SN>): SectionNodeMaker<SN>[] {
    const sectionNodeMakers: SectionNodeMaker<SN>[] = [];
    for (const [sectionName, dbIds] of Obj.entries(childDbIds)) {
      const feIds = childFeIds[sectionName];
      for (const [idx, dbId] of Obj.entries(dbIds)) {
        sectionNodeMakers.push({
          dbId,
          feId: feIds[idx],
          sectionName,
          parentInfo,
        } as OneSectionNodeMaker<SectionName> as SectionNodeMaker<SN>);
      }
    }
    return sectionNodeMakers;
  }
  makeOrderedPreSections(
    props: SectionPackSupplements<SN>
  ): FeSelfOrDescendantNode<SN>[] {
    const orderedPreSections: FeSelfOrDescendantNode<SN>[] = [];
    const queue: SectionNodeMaker<SN>[] = [];
    queue.push(this.makeHeadNodeMaker(props));
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const nodeMaker = queue.shift() as SectionNodeMaker<SN>;
        const feNode = this.makeFeNode(nodeMaker);
        orderedPreSections.push(feNode);
        const parentStub = this.makeParentStub(feNode);
        queue.push(...this.makeNodeMakers(parentStub));
      }
    }
    return orderedPreSections;
  }
}
