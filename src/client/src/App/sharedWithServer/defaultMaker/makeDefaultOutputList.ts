import { SectionPackRaw } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

export const defaultDealOutputInfos = outputNames.map((varbName) => {
  return {
    id: "static",
    idType: "relative",
    sectionName: "deal",
    varbName,
  } as const;
});

export function makeDefaultOutputList(): SectionPackRaw<"dealOutputList"> {
  const main = PackBuilderSection.initAsMain();
  const outputList = main.addAndGetDescendant(["deal", "dealOutputList"]);
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("output", {
      dbVarbs: outputVarbInfo,
    });
  }
  return outputList.makeSectionPack();
}
