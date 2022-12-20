import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { inEntityInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

const defaultDealOutputInfos: InEntityVarbInfo[] = outputNames.map(
  (varbName) => {
    return mixedInfoS.absoluteVarbPath("dealFocal", varbName);
  }
);

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("outputItem", {
      dbVarbs: {
        valueSwitch: "loadedVarb",
        valueEntityInfo: inEntityInfo(outputVarbInfo),
      },
    });
  }
  return outputList.makeSectionPack();
}
