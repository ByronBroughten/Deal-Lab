import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { DealMode } from "../SectionsMeta/values/StateValue/unionValues";
import { GetterSection } from "../StateGetters/GetterSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import { SolverSection } from "./SolverSection";
import { SolverSections } from "./SolverSections";

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
  setDealMode(dealMode: DealMode): void {
    this.sections.changeActiveDealMode(dealMode);
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return this.sections.solverSection(feInfo);
  }
  get property(): SolverSection<"property"> {
    return this.solverSection(this.get.onlyChild("property").feInfo);
  }
  get units(): SolverSection<"unit">[] {
    return this.property.children("unit");
  }
  get financing(): SolverSection<"financing"> {
    return this.solverSection(this.get.onlyChild("financing").feInfo);
  }
  static init(dealMode: DealMode) {
    const deal = SolverSections.initDefault().getActiveDeal();
    deal.updateValuesAndSolve({ dealMode });
    const property = deal.onlyChild("property");
    property.updateValuesAndSolve({ propertyMode: dealMode });
    return new SolverActiveDeal(deal.solverSectionProps);
  }
}
