import { SectionPack } from "../SectionPack/SectionPack";
import { DealMode } from "../sectionVarbsConfig/StateValue/dealMode";
import { StrictExclude } from "../utils/types";
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
  return exampleDealMakers[dealMode](displayName);
}
