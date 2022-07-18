import { SectionPack } from "../SectionPack/SectionPack";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { Id } from "../SectionsMeta/baseSectionsUtils/id";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

const defaultDealOutputInfos: InEntityVarbInfo[] = outputNames.map(
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
    outputList.addChild("outputItem", {
      dbVarbs: { valueEntityInfo: { ...outputVarbInfo, entityId: Id.make() } },
    });
  }
  return outputList.makeSectionPack();
}
