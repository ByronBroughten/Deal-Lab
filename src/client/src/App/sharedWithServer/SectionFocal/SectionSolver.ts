import { HasSectionInfoProps } from "../HasInfoProps/HasSectionInfoProps";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { FeSections } from "../SectionsState/SectionsState";
import { GetterSections } from "../StateGetters/GetterSections";
import { SolverSections, SolverShared } from "../StateSolvers/SolverSections";
import { StrictOmit } from "../utils/types";
import { DefaultOrNewChildAdder } from "./DefaultOrNewDescendantAdder";

export interface SectionSolverProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  shared: SolverShared;
}

interface SectionSolverInitProps<SN extends SectionName>
  extends StrictOmit<SectionSolverProps<SN>, "shared"> {
  shared: {
    sections: FeSections;
    varbFullNamesToSolveFor?: Set<string>;
  };
}

// should SectionSolver not extend FocalSectionBase, since it has a different shared?
export class SectionSolver<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  readonly shared: SolverShared;
  private getterSections: GetterSections;
  private adder: DefaultOrNewChildAdder<SN>;
  private solverSections: SolverSections;
  constructor(props: SectionSolverProps<SN>) {
    super(props);
    this.shared = props.shared;
    this.getterSections = new GetterSections(props.shared);
    this.adder = new DefaultOrNewChildAdder(props);
    this.solverSections = new SolverSections(props.shared);
  }
  static init<S extends SectionName>(
    props: SectionSolverInitProps<S>
  ): SectionSolver<S> {
    if (!props.shared.varbFullNamesToSolveFor) {
      props.shared.varbFullNamesToSolveFor = new Set();
    }
    return new SectionSolver(props as SectionSolverProps<S>);
  }
  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
  }
  get sections(): FeSections {
    return this.shared.sections;
  }
  addChildAndSolve(childName: ChildName<SN>) {
    this.adder.addChild(childName);
    const { selfAndDescendantVarbInfos } =
      this.getterSections.newestEntry(childName);
    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.solverSections.solve();
  }
  private addVarbInfosToSolveFor(...varbInfos: VarbInfo[]) {
    const fullNames = varbInfos.map((info) =>
      FeVarb.feVarbInfoToFullName(info)
    );
    this.shared.varbFullNamesToSolveFor = new Set([
      ...this.varbFullNamesToSolveFor,
      ...fullNames,
    ]);
  }
}
