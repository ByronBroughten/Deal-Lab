import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { ValueFixedVarbPathName } from "../StateEntityGetters/ValueInEntityInfo";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

type OutputVarbPathNames = Record<
  DealMode<"plusMixed">,
  ValueFixedVarbPathName[]
>;

const outputVarbPathNames: OutputVarbPathNames = {
  homeBuyer: ["totalInvestment", "ongoingPitiMonthly", "dealExpensesYearly"],
  buyAndHold: ["totalInvestment", "cashFlowYearly", "cocRoiYearly"],
  fixAndFlip: [
    "totalInvestment",
    "totalProfit",
    "roiPercent",
    "roiPercentAnnualized",
  ],
  brrrr: [
    "totalInvestment",
    "totalProfit",
    "roiPercent",
    "roiPercentAnnualized",
    "cashFlowYearly",
    "cocRoiYearly",
  ],
  mixed: [
    "totalInvestment",
    "totalProfit",
    "roiPercent",
    "roiPercentAnnualized",
    "cashFlowYearly",
    "cocRoiYearly",
  ],
};

export const defaultCompareInfos = defaultOutputInfos("buyAndHold");
export function defaultOutputInfos(dealMode: DealMode<"plusMixed">) {
  const names = outputVarbPathNames[dealMode];
  return names.map((name) => mixedInfoS.varbPathName(name));
}

export function makeDefaultOutputList(
  dealMode: DealMode<"plusMixed">
): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  const infos = defaultOutputInfos(dealMode);
  for (const info of infos) {
    const item = outputList.addAndGetChild("outputItem");
    item.updateValues({ valueEntityInfo: inEntityValueInfo(info) });
  }
  return outputList.makeSectionPack();
}
