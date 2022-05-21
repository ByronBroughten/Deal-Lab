
import {
  InEntityVarbInfo
} from "../SectionsMeta/baseSections/baseValues/entities";
import { FeVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { OutEntity } from "../SectionsState/FeSection/FeVarb/entities";

// Sections—readonly. Maybe even no getters or setters.

// UpdatableSections—contains shared sections, has the 6 getters and updaters (setters)
// BuilderSections—contains shared sections, inherits from UpdatableSections; has some of the add and remove stuff
// SolverSections—contains shared sections, inherits from UpdatableSections; contains BuilderSections; /// adds entity management to BuilderSection operations

// make a folder for State
// make a folder for FocalSection
// make a folder for Sections

// Each focal section contains
// 1. self (SelfGetters)
// 2. a nested focalSection to build upon if need be
// 3. a sections, for getting and updating sections generally if need be.

type AddOutEntityProps = {
  targetVarb: InEntityVarbInfo;
  outEntity: OutEntity;
};

// Here is where I can put the functions I want to implement:
// SolverSections
// SectionSolver

// Here is what I must implement:
// directUpdateAndSolve (SectionSolver)
// updateConnectedEntities (SectionSolver)

// Remove inEntity, add inEntity
// solve (SolverSections)

// for now this should only need SolverSections and defaultAdder







// class HasSectionSolverProps<SN extends SectionName> extends HasFocalSectionProps<SN> {
//   readonly fullSection: FullSectionI<SN>;
//   private varbFullNamesToSolveFor: Set<string>;
//   private SolverSections: SolverSections<SN>;
//   constructor(props: FocalSectionConstructorProps<SN>) {
//     super(props);
//     this.fullSection = new FullSection(props) as any as FullSectionI<SN>;
//     this.varbFullNamesToSolveFor = new Set();
//   }
// }




function MakeSectionSolver<
  SN extends SectionName,
  TBase extends GConstructor<SectionSolverMixins<SN>>
>(Base: TBase) {
  return class SectionSolver extends Base {
    addChildAndSolve(childName: ChildName<SN>) {
      if (defaultSectionPacks.has(childName)) {
        const sectionPack = defaultSectionPacks.get(childName);
        this.fullSection.loadChildSectionPack(sectionPack);
      } else {
        this.fullSection.addChild(childName);
      }

      const addedChild = this.fullSection.lastChild(childName);
      const { selfAndDescendantVarbInfos } =  addedChild;
      this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
      this.solve();
    }


    editorUpdateAndSolve() {}

    protected solveVarbs() {
      const orderedInfos = this.gatherAndSortInfosToSolve();
      for (const info of orderedInfos) {
        this.solveAndUpdateValue(info);
      }
      this.varbFullNamesToSolveFor = new Set();
    }


    
    // fullSection should have updateValueDirectly
    private solveAndUpdateValue(feVarbInfo: FeVarbInfo) {
      // solveValue will need to take sections rather than analyzer
      const newValue = solveValue(analyzer, feVarbInfo);
      if (newValue !== undefined) {
        
      }

        return internal.updateValueDirectly(analyzer, feVarbInfo, newValue);
      else return analyzer;
    }

    private get varbInfosToSolveFor(): FeVarbInfo[] {
      return [...this.varbFullNamesToSolveFor].map((fullName) =>
        FeVarb.fullNameToFeVarbInfo(fullName)
      );
    }
    private addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]) {
      const fullNames = varbInfos.map((info) => FeVarb.feVarbInfoToFullName(info));
      this.varbFullNamesToSolveFor = new Set([
        ...this.varbFullNamesToSolveFor,
        ...fullNames
      ]);
    }
  }
}


