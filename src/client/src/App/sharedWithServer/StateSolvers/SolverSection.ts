import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { StateSections } from "../StateSections/StateSectionsNext";
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
  private loader = new PackLoaderSection(
    this.getterSectionBase.getterSectionProps
  );
  private getterSection = new GetterSection(
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
    this.solve();
  }
  loadSelfSectionPack(sectionPack: SectionPackRaw<SN>) {
    this.loader.updateSelfWithSectionPack(sectionPack);
    const { selfAndDescendantVarbInfos } = this.getterSection;
    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.solve();
  }
  private solve() {
    this.solverSections.solve();
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPackRaw<"main">
  ): StateSections {
    const sections = StateSections.initWithMain();
    const loader = SolverSection.init({
      ...sections.rawSectionList("main")[0],
      sectionsShare: { sections },
    });
    loader.loadSelfSectionPack(sectionPack);
    return loader.sectionsShare.sections;
  }
  static initSectionsFromDefaultMain() {
    const defaultMainPack = defaultMaker.make("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
}
