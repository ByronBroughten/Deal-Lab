import {
  SolverSections,
  SolverShared,
  SolverSharedProps,
} from "../Sections/SolverSections";
import { FeVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { DefaultOrNewChildAdder } from "./DefaultOrNewDescendantAdder";
import { FocalSectionBase } from "./FocalSectionBase";
import {
  SectionSelfGetters,
  SectionSelfGettersProps,
} from "./SectionSelfGetters";

interface SectionSolverProps<SN extends SectionName>
  extends SolverSharedProps,
    SectionSelfGettersProps<SN> {}
export class SectionSolver<
  SN extends SectionName
> extends FocalSectionBase<SN> {
  readonly shared: SolverShared;
  constructor(props: SectionSolverProps<SN>) {
    super(props);
    const { sections, varbFullNamesToSolveFor } = props;
    this.shared = {
      sections,
      varbFullNamesToSolveFor: varbFullNamesToSolveFor ?? new Set(),
    };
  }

  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
  }

  private adder = new DefaultOrNewChildAdder(this.self.constructorProps);
  private sections = new SolverSections(this.shared);
  addChildAndSolve(childName: ChildName<SN>) {
    this.adder.addChild(childName);
    const addedChild = this.sections.newestEntry(childName);

    const childGetter = new SectionSelfGetters({
      shared: this.shared,
      ...addedChild.info,
    });
    const { selfAndDescendantVarbInfos } = childGetter;

    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.sections.solve();
  }
  // editorUpdateAndSolve() {}

  private addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]) {
    const fullNames = varbInfos.map((info) =>
      FeVarb.feVarbInfoToFullName(info)
    );
    this.shared.varbFullNamesToSolveFor = new Set([
      ...this.varbFullNamesToSolveFor,
      ...fullNames,
    ]);
  }
}
