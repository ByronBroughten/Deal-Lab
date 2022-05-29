import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { DefaultOrNewChildAdder } from "../StateUpdaters/DefaultOrNewDescendantAdder";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { HasSolveShare } from "./SolverBases/SolverSectionsBase";
import { SolverSections } from "./SolverSections";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  private getterSections = new GetterSections(
    this.getterSectionsBase.sectionsShare
  );
  private adder = new DefaultOrNewChildAdder(
    this.getterSectionBase.getterSectionProps
  );
  private solverSections = new SolverSections(this.solverSectionsProps);

  static init<S extends SectionName>(
    props: SolverSectionInitProps<S>
  ): SolverSection<S> {
    if (!props.solveShare) {
      props.solveShare = {
        varbFullNamesToSolveFor: new Set(),
      };
    }
    return new SolverSection(props as SolverSectionProps<S>);
  }
  get varbFullNamesToSolveFor(): Set<string> {
    return this.solveShare.varbFullNamesToSolveFor;
  }
  addChildAndSolve(childName: ChildName<SN>) {
    this.adder.addChild(childName);
    const { selfAndDescendantVarbInfos } =
      this.getterSections.newestEntry(childName);
    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.solverSections.solve();
  }
}
