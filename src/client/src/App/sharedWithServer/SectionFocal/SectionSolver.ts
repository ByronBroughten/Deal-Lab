import { FeSections } from "../SectionsState/SectionsState";

// Sections—readonly. Maybe even no getters or setters.

// UpdatableSections—contains shared sections, has the 6 getters and updaters (setters)
// BuilderSections—contains shared sections, inherits from UpdatableSections; has some of the add and remove stuff
// EntitySections—contains shared sections, inherits from UpdatableSections; contains BuilderSections; /// adds entity management to BuilderSection operations

// make a folder for State
// make a folder for FocalSection
// make a folder for Sections

// Each focal section contains
// 1. self (SelfGetters)
// 2. a nested focalSection to build upon if need be
// 3. a sections, for getting and updating sections generally if need be.

class EntitySections {
  constructor(readonly shared: { sections: FeSections }) {}
  get sections() {
    return this.shared.sections;
  }

  // directUpdateAndSolve(props: { varbName: string, value: StateValue }) {
  //   this.sections.updateValueDirectly({ ...props, ...this.info })

  //   next = next.updateConnectedEntities({
  //     currentEntities: varb.inEntities,
  //     nextEntities: nextVarb.inEntities
  //   });
  //   return next.updateVarb(nextVarb);
  // }
}
// private updateConnectedEntities({
//   varbInfo,
//   currentEntities,
//   nextEntities,
// }: {
//   varbInfo: VarbInfo;
//   currentEntities: InEntity[];
//   nextEntities: InEntity[];
// }) {
//   const outEntity = {
//     ...feVarbInfo,
//     entityId: Id.make(),
//   };

//   const missingEntities = currentEntities.filter(
//     (entity) => !entityS.entitiesHas(nextEntities, entity)
//   );
//   const newEntities = nextEntities.filter(
//     (entity) => !entityS.entitiesHas(currentEntities, entity)
//   );

//   let next = this;
//   for (const entity of missingEntities) {
//     if (next.hasSection(entity)) {
//       // removeInEntity
//       next = internal.removeInEntity(next, outEntity, entity);
//     }
//   }
//   for (const entity of newEntities) {
//     next = internal.addInEntity(next, outEntity, entity);
//   }
//   return next;
// }

// class HasSectionSolverProps<SN extends SectionName> extends HasFocalSectionProps<SN> {
//   readonly fullSection: FullSectionI<SN>;
//   private varbFullNamesToSolveFor: Set<string>;
//   private entitySections: EntitySections<SN>;
//   constructor(props: FocalSectionConstructorProps<SN>) {
//     super(props);
//     this.fullSection = new FullSection(props) as any as FullSectionI<SN>;
//     this.varbFullNamesToSolveFor = new Set();
//   }
// }

// function MakeSectionSolver<
//   SN extends SectionName,
//   TBase extends GConstructor<SectionSolverMixins<SN>>
// >(Base: TBase) {
//   return class SectionSolver extends Base {
//     addChildAndSolve(childName: ChildName<SN>) {
//       if (defaultSectionPacks.has(childName)) {
//         const sectionPack = defaultSectionPacks.get(childName);
//         this.fullSection.loadChildSectionPack(sectionPack);
//       } else {
//         this.fullSection.addChild(childName);
//       }

//       const addedChild = this.fullSection.lastChild(childName);
//       const { selfAndDescendantVarbInfos } =  addedChild;
//       this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
//       this.solve();
//     }

//     // If this uses Mixins, it has to be a mixin. Is that right?

//     editorUpdateAndSolve() {

//     }

//     protected solveVarbs() {

//       const orderedInfos = this.gatherAndSortInfosToSolve();
//       for (const info of orderedInfos) {
//         next = solveAndUpdateValue(next, info);
//       }

//       this.varbFullNamesToSolveFor = new Set();
//     }

//     // fullSection should have updateValueDirectly

//     private solveAndUpdateValue(feVarbInfo: FeVarbInfo) {
//       // solveValue will need to take sections rather than analyzer
//       const newValue = solveValue(analyzer, feVarbInfo);
//       if (newValue !== undefined) {

//       }

//         return internal.updateValueDirectly(analyzer, feVarbInfo, newValue);
//       else return analyzer;
//     }

//     private get varbInfosToSolveFor(): FeVarbInfo[] {
//       return [...this.varbFullNamesToSolveFor].map((fullName) =>
//         FeVarb.fullNameToFeVarbInfo(fullName)
//       );
//     }
//     private addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]) {
//       const fullNames = varbInfos.map((info) => FeVarb.feVarbInfoToFullName(info));
//       this.varbFullNamesToSolveFor = new Set([
//         ...this.varbFullNamesToSolveFor,
//         ...fullNames
//       ]);
//     }

//     private gatherAndSortInfosToSolve(): FeVarbInfo[] {
//       const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs();
//       let solveOrder = tsort(edges);
//       solveOrder = solveOrder.concat(loneVarbs);
//       return solveOrder.map((stringInfo) =>
//         FeVarb.fullNameToFeVarbInfo(stringInfo)
//       );
//     }
//     private getDagEdgesAndLoneVarbs() {
//       const outVarbMap = this.getOutVarbMap();
//       const edges: [string, string][] = [];
//       const loneVarbs = Object.keys(outVarbMap).filter(
//         (k) => outVarbMap[k].length === 0
//       );
//       for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
//         for (const outString of outStrings) {
//           if (loneVarbs.includes(outString))
//             Arr.rmFirstValueMutate(loneVarbs, outString);
//           edges.push([stringInfo, outString]);
//         }
//       }
//       return { edges, loneVarbs };
//     }
//     private getOutVarbMap(
//       visitedInfos: string[] = [],
//       parentStringInfo?: string
//     ): OutVarbMap {
//       const outVarbMap: OutVarbMap = {};

//       // I see.
//       // This creates a map of each varbInfoFullName and the varbs that depend on it.

//       // I see. here I'm collecting all the outVarbs that depend on the varbs.

//       // What are my other options?
//       // 1. Collect the nested outVarbs in advance, while collecting the varbInfos
//       // or whenever I add varbInfos to varbFullNamesToSolveFor--I like that.

//       // then here I just roll through em.

//       for (const stringInfo of [...this.varbFullNamesToSolveFor]) {
//         if (visitedInfos.includes(stringInfo)) continue;
//         if (!(stringInfo in outVarbMap)) outVarbMap[stringInfo] = [];
//         if (parentStringInfo && !outVarbMap[parentStringInfo].includes(stringInfo))
//           outVarbMap[parentStringInfo].push(stringInfo);
//         visitedInfos.push(stringInfo);
//         const outInfos = this.outVarbInfos(info);
//         this.getOutVarbMap(outInfos, outVarbMap, visitedInfos, stringInfo);
//       }
//       return outVarbMap;
//     }
//   }
// }

type OutVarbMap = Record<string, string[]>;
