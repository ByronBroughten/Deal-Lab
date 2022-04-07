import { Obj } from "../utils/Obj";
// import { RawSectionPack } from "./NextSectionPack";
// import { SectionName } from "./SectionMetas/SectionName";
// import { RawSections, RawSection } from "./SectionPacks/RawSection";
// import { RawSectionFinder } from "./SectionPacks/RawSectionFinder";
// import {
//   NameToNameWithSameChildren,
//   NextChildIdArrs,
//   NextChildIdArrsWide,
// } from "./SectionMetas/relNameArrs/ChildTypes";
// import { ParentFinder } from "./SectionMetas/relNameArrs/ParentTypes";
// import {
//   FeSectionNode,
//   OneFeSectionNode,
//   SectionNodeMaker,
// } from "./FeSectionPacks/FeSectionNode";

// type FeSectionPackCore<SN extends SectionName> = RawSectionPack<SN, "fe">;
// export class FeSectionPack<SN extends SectionName> {
//   constructor(readonly core: FeSectionPackCore<SN>) {}
//   get sectionName(): SN {
//     return this.core.sectionName;
//   }
//   get dbId(): string {
//     return this.core.dbId;
//   }
//   get rawSections(): RawSections<SN, "fe"> {
//     return this.core.rawSections;
//   }
//   get headSectionFinder() {
//     return {
//       sectionName: this.sectionName,
//       dbId: this.dbId,
//     };
//   }
//   rawSection({
//     sectionName,
//     dbId,
//   }: RawSectionFinder<SN, "fe">): RawSection<SN, "fe"> {
//     const rawSections = this.rawSections[sectionName] as GeneralRawSection[];
//     const rawSection = rawSections.find(
//       (rawSection) => rawSection.dbId === dbId
//     );
//     if (rawSection) return rawSection as any;
//     else throw new Error(`No rawSection found at ${sectionName}.${dbId}`);
//   }
//   changeType<NextSN extends NameToNameWithSameChildren<SN, "fe", "fe">>(
//     sectionName: NextSN
//   ): FeSectionPack<NextSN> {
//     const nextCore = {
//       ...this.core,
//       sectionName,
//     } as any as FeSectionPackCore<NextSN>;
//     return new FeSectionPack(nextCore);
//   }
//   static dbToFeIds<CIDS extends NextChildIdArrs<"fe">>(childDbIds: CIDS): CIDS {
//     const childFeIds = Obj.entries(
//       childDbIds as NextChildIdArrsWide<"fe">
//     ).reduce((childFeIds, [childName, dbIdArr]) => {
//       childFeIds[childName] = dbIdArr.map(() => Id.make());
//       return childFeIds;
//     }, {} as NextChildIdArrsWide<"fe">);
//     return childFeIds as NextChildIdArrs<"fe"> as CIDS;
//   }
//   parentFirstFeNodes<PF extends ParentFinder<SN, "fe">>(
//     parentFinder: PF
//   ): FeSectionNode<SN>[] {
//     const feSectionNodes: FeSectionNode<SN>[] = [];
//     const headNode = this.makeHeadFeNode(parentFinder);
//     feSectionNodes.push(headNode);
//   }
//   makeHeadFeNode<PF extends ParentFinder<SN, "fe">>(
//     parentFinder: PF
//   ): OneFeSectionNode<SN> {
//     return {
//       feId: Id.make(),
//       parentFinder,
//       sectionName: this.sectionName,
//       dbId: this.core.dbId,
//       dbVarbs: this.core.dbVarbs,
//       childFeIds: FeSectionPack.dbToFeIds(this.childDbIds),
//     };
//   }
//   makeFeNode(nodeMaker: SectionNodeMaker<SN>): FeSectionNode<SN> {
//     const { dbVarbs, childDbIds } = this.rawSection(nodeMaker);
//     return {
//       ...nodeMaker,
//       dbVarbs,
//       childFeIds: FeSectionPack.dbToFeIds(childDbIds) as OneChildIdArrs<
//         SN,
//         "fe"
//       >,
//     } as FeSectionNode<SN>;
//   }
//   makeParentStub(feNode: FeSectionNode<SN>): FeNodeParentStub<SN> {
//     const { childDbIds } = this.rawSection(feNode);
//     return {
//       feInfo: Inf.fe(childMaker.sectionName, childMaker.feId),
//       childDbIds,
//       childFeIds,
//     };
//   }
//   private orderedDescendentNodeMakers(
//     headNode: OneFeSectionNode<SN>
//   ): RawSectionFinder<SN, "fe">[] {
//     const descendantNodeMakers: SectionNodeMaker<SN>[] = [];
//     const headParentStub: OneFeNodeParentStub<SN> = {
//       feInfo: Inf.fe(headNode.sectionName, headNode.feId),
//       childFeIds: headNode.childFeIds,
//       childDbIds: this.childDbIds,
//     };
//     const parentStubs = [headParentStub] as FeNodeParentStub<SN>[];
//     while (parentStubs.length > 0) {
//       for (const parentStub of parentStubs) {
//         const childNodeMakers = this.makeSectionNodeMakers(parentStub);
//         for (const childMaker of childNodeMakers) {
//           // with each childMaker, I make a parentStub (which is where the childFeids are made)

//           // and then I make a sectionNode
//           // which takes a childMaker and the childFeids

//           const { childDbIds, dbVarbs } = this.rawSection(childMaker);

//           const childFeIds = FeSectionPack.dbToFeIds(childDbIds);
//           const { sectionName, parentFinder, dbId, feId } = childMaker;
//           const feSectionNode = {
//             sectionName,
//             parentFinder,
//             childFeIds,
//             dbId,
//             feId,
//             dbVarbs,
//           } as any as FeSectionNode<SN>;

//           parentStubs.push({
//             feInfo: Inf.fe(childMaker.sectionName, childMaker.feId),
//             childDbIds,
//             childFeIds,
//           } as FeNodeParentStub<SN>);
//         }
//       }
//     }
//     return descendantNodeMakers;
//   }
//   makeSectionNodeMakers({
//     feInfo,
//     childDbIds,
//     childFeIds,
//   }: FeNodeParentStub<SN>): SectionNodeMaker<SN>[] {
//     const sectionNodeMakers: SectionNodeMaker<SN>[] = [];
//     for (const [sectionName, dbIds] of Obj.entries(childDbIds)) {
//       const feIds = childFeIds[sectionName];
//       for (const [idx, dbId] of Obj.entries(dbIds)) {
//         sectionNodeMakers.push({
//           dbId,
//           feId: feIds[idx],
//           sectionName,
//           parentFinder: feInfo,
//         } as SectionNodeMaker<SN>);
//       }
//     }
//     return sectionNodeMakers;
//   }
// }
