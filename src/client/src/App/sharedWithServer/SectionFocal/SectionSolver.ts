import { SolverSections, SolverShared } from "../Sections/SolverSections";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { FeVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { HasSectionInfoProps } from "../SectionsState/HasSectionInfoProps";
import { FeSections } from "../SectionsState/SectionsState";
import { StrictOmit } from "../utils/types";
import { DefaultOrNewChildAdder } from "./DefaultOrNewDescendantAdder";
import { SectionSelfGetters } from "./SectionSelfGetters";

interface SectionSolverProps<SN extends SectionName> extends FeSectionInfo<SN> {
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
  private selfSection: SectionSelfGetters<SN>;
  private adder: DefaultOrNewChildAdder<SN>;
  private solverSections: SolverSections;
  constructor(props: SectionSolverProps<SN>) {
    super(props);
    this.shared = props.shared;
    this.selfSection = new SectionSelfGetters(props);
    this.adder = new DefaultOrNewChildAdder(this.selfSection.constructorProps);
    this.solverSections = new SolverSections(this.shared);
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
    const addedChild = this.sections.newestEntry(childName);

    const childGetter = this.sections.makeFocalGetter(addedChild.info);
    const { selfAndDescendantVarbInfos } = childGetter;

    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.solverSections.solve();
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
