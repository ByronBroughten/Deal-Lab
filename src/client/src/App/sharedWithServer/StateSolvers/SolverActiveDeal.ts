import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";
import { GetterSection } from "../StateGetters/GetterSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import { SolverSection } from "./SolverSection";
import { SolverSections } from "./SolverSections";
import { TopOperator } from "./TopOperator";

export class SolverActiveDeal extends SolverSectionBase<"deal"> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get solver() {
    return new SolverSection(this.solverSectionProps);
  }
  get sections() {
    return new SolverSections(this.solverSectionsProps);
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return this.sections.solverSection(feInfo);
  }
  changeDealMode(dealMode: DealMode) {
    this.solver.updateValues({ dealMode });
    this.property.updateValues({ propertyMode: dealMode });
  }
  get property(): SolverSection<"property"> {
    return this.solverSection(this.get.onlyChild("property").feInfo);
  }
  get units(): SolverSection<"unit">[] {
    return this.property.children("unit");
  }
  get purchaseFinancing(): SolverSection<"financing"> {
    return this.solverSection(this.get.onlyChild("purchaseFinancing").feInfo);
  }
  get refiFinancing(): SolverSection<"financing"> {
    return this.solverSection(this.get.onlyChild("refiFinancing").feInfo);
  }
  get mgmt(): SolverSection<"mgmt"> {
    return this.solverSection(this.get.onlyChild("mgmtOngoing").feInfo);
  }
  static init(dealMode: DealMode) {
    const topOperator = TopOperator.initWithDefaultActiveDealAndSolve();

    const deal = topOperator.prepper.getActiveDeal();
    deal.updateValues({ dealMode });
    const property = deal.onlyChild("property");
    property.updateValues({ propertyMode: dealMode });

    topOperator.solve();
    return new SolverActiveDeal(deal.prepperSectionProps);
  }
}
