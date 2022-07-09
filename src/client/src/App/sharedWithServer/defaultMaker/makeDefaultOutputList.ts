import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

export const defaultDealOutputInfos = outputNames.map((varbName) => {
  return {
    id: "static",
    infoType: "relative",
    sectionName: "deal",
    varbName,
  } as const;
});

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("output", {
      dbVarbs: outputVarbInfo,
    });
  }
  return outputList.makeSectionPack();
}
