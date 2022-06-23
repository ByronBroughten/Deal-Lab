import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

export const defaultDealOutputInfos = [
  {
    id: "static",
    idType: "relative",
    sectionName: "final",
    varbName: "totalInvestment",
  },
  {
    id: "static",
    idType: "relative",
    sectionName: "final",
    varbName: "cashFlowYearly",
  },
  {
    id: "static",
    idType: "relative",
    sectionName: "final",
    varbName: "roiYearly",
  },
] as const;

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
