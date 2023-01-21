import { ValueInEntityInfo } from "../SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import { inEntityIdInfo } from "../SectionsMeta/allBaseSectionVarbs/baseValues/InEntityIdInfoValue";
import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "cocRoiYearly",
] as const;

const defaultDealOutputInfos: ValueInEntityInfo[] = outputNames.map(
  (varbName) => {
    return mixedInfoS.pathNameVarb("dealFocal", varbName);
  }
);

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("outputItem", {
      dbVarbs: {
        valueSourceSwitch: "loadedVarb",
        valueEntityInfo: inEntityIdInfo(outputVarbInfo),
      },
    });
  }
  return outputList.makeSectionPack();
}
