import { SectionPack } from "../SectionPack/SectionPack";
import { InEntityVarbInfoValue } from "../SectionsMeta/baseSectionsUtils/baseValues/InEntityVarbInfoValue";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

const defaultDealOutputInfos: InEntityVarbInfoValue[] = outputNames.map(
  (varbName) => {
    return {
      ...mixedInfoS.makeGlobalSection("deal", "onlyOne"),
      varbName,
    } as const;
  }
);

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("output", {
      dbVarbs: {
        varbInfo: outputVarbInfo,
      },
    });
  }
  return outputList.makeSectionPack();
}
