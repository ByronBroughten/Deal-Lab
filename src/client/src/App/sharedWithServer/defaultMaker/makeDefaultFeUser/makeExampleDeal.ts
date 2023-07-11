import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { DealMode } from "../../SectionsMeta/values/StateValue/dealMode";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { StrictExclude } from "../../utils/types";
import { exampleDealBuyAndHold } from "./exampleDealBuyAndHold";
import { exampleDealHomebuyer } from "./exampleDealHomebuyer";

const exampleDealMakers = {
  homeBuyer: exampleDealHomebuyer,
  buyAndHold: exampleDealBuyAndHold,
};

export function makeExampleDeal(
  dealMode: StrictExclude<DealMode, "brrrr" | "fixAndFlip">,
  displayName: string
): SectionPack<"deal"> {
  const dealPack = exampleDealMakers[dealMode](displayName);
  const sections = SolverSections.initSectionsFromDefaultMain();
  const solverSections = SolverSections.init({ sectionsShare: { sections } });
  solverSections.addActiveDeal(dealMode, { sectionPack: dealPack });
  return solverSections.getActiveDeal().packMaker.makeSectionPack();
}
