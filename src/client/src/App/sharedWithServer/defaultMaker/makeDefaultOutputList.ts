import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { ValueInEntityInfo } from "../StateEntityGetters/ValueInEntityInfo";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "cocRoiYearly",
] as const;

export const fixAndFlipOutputNames = [
  "totalInvestment",
  "totalProfit",
  "roi",
  "roiAnnualized",
] as const;

export const defaultDealOutputInfos: ValueInEntityInfo[] = outputNames.map(
  (varbPathName) => {
    return mixedInfoS.varbPathName(varbPathName);
  }
);

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    const item = outputList.addAndGetChild("outputItem");
    item.updateValues({ valueEntityInfo: inEntityValueInfo(outputVarbInfo) });
  }
  return outputList.makeSectionPack();
}
