import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { ValueFixedVarbPathName } from "../StateEntityGetters/ValueInEntityInfo";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

type OutputVarbPathNames = Record<
  StateValue<"dealMode">,
  ValueFixedVarbPathName[]
>;

const outputVarbPathNames: OutputVarbPathNames = {
  buyAndHold: ["totalInvestment", "cashFlowYearly", "cocRoiYearly"],
  fixAndFlip: [
    "totalInvestment",
    "totalProfit",
    "roiPercent",
    "roiPercentAnnualized",
  ],
};

export const defaultCompareInfos = defaultOutputInfos("buyAndHold");
function defaultOutputInfos(dealMode: StateValue<"dealMode">) {
  const names = outputVarbPathNames[dealMode];
  return names.map((name) => mixedInfoS.varbPathName(name));
}

export function makeDefaultOutputList(
  dealMode: StateValue<"dealMode">
): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  const infos = defaultOutputInfos(dealMode);
  for (const info of infos) {
    const item = outputList.addAndGetChild("outputItem");
    item.updateValues({ valueEntityInfo: inEntityValueInfo(info) });
  }
  return outputList.makeSectionPack();
}
