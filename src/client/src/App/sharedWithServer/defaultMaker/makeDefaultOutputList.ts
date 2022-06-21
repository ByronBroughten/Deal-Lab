import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultOutputList(): SectionPackRaw<"dealOutputList"> {
  const main = PackBuilderSection.initAsMain();
  const outputList = main.addAndGetDescendant(["deal", "dealOutputList"]);
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "totalInvestment",
    },
  });
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "cashFlowYearly",
    },
  });
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "roiYearly",
    },
  });
  return outputList.makeSectionPack();
}
