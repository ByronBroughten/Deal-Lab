import { mixedInfoS } from "../../StateGetters/Identifiers/MixedSectionInfo";
import { ValueFixedVarbPathName } from "../../StateGetters/Identifiers/ValueInEntityInfo";
import { DealMode } from "../../stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { inEntityValueInfo } from "../../stateSchemas/schema4ValueTraits/StateValue/InEntityValue";
import { stringObj } from "../../stateSchemas/schema4ValueTraits/StateValue/StringObj";
import { SectionPack } from "../../StateTransports/SectionPack";
import { PackBuilderSection } from "../Packers/PackBuilderSection";

type OutputVarbPathNames = Record<
  DealMode<"plusMixed">,
  ValueFixedVarbPathName[]
>;

const outputVarbPathNames: OutputVarbPathNames = {
  homeBuyer: [
    "totalInvestment",
    "dealNetExpensesOngoingMonthly",
    "netNonPrincipalOngoingMonthly",
  ],
  buyAndHold: ["totalInvestment", "cashFlowYearly", "cocRoiYearly"],
  fixAndFlip: [
    "totalInvestment",
    "vaProfitOnSale",
    "vaRoiOnSalePercent",
    "vaRoiOnSalePercentAnnualized",
  ],
  brrrr: [
    "totalInvestment",
    "valueAddProfit",
    "valueAddRoiPercent",
    "valueAddRoiPercentAnnualized",
    "cashFlowYearly",
    "cocRoiYearly",
  ],
  mixed: [
    "totalInvestment",
    "valueAddProfit",
    "valueAddRoiPercent",
    "valueAddRoiPercentAnnualized",
    "cashFlowYearly",
    "cocRoiYearly",
  ],
};

const outputListDisplayNames: Record<DealMode<"plusMixed">, string> = {
  homeBuyer: "Homebuyer examples",
  buyAndHold: "Rental property examples",
  fixAndFlip: "Fix & flip examples",
  brrrr: "BRRRR examples",
  mixed: "Mixed examples",
};

export const defaultCompareInfos = defaultOutputInfos("buyAndHold");
export function defaultOutputInfos(dealMode: DealMode<"plusMixed">) {
  const names = outputVarbPathNames[dealMode];
  return names.map((name) => mixedInfoS.varbPathName(name));
}

function defaultDisplayName(dealMode: DealMode<"plusMixed">): string {
  return outputListDisplayNames[dealMode];
}

export function makeDefaultOutputList(
  dealMode: DealMode<"plusMixed">
): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  outputList.updateValues({
    displayName: stringObj(defaultDisplayName(dealMode)),
  });
  const infos = defaultOutputInfos(dealMode);
  for (const info of infos) {
    const item = outputList.addAndGetChild("outputItem");
    item.updateValues({ valueEntityInfo: inEntityValueInfo(info) });
  }
  return outputList.makeSectionPack();
}
