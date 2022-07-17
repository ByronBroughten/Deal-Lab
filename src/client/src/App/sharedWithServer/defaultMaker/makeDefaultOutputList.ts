import { SectionPack } from "../SectionPack/SectionPack";
import { InEntityValueInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/InEntityVarbInfoValue";
import { Id } from "../SectionsMeta/baseSectionsUtils/id";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const outputNames = [
  "totalInvestment",
  "cashFlowYearly",
  "roiYearly",
] as const;

const defaultDealOutputInfos: InEntityValueInfo[] = outputNames.map(
  (varbName) => {
    return {
      ...mixedInfoS.makeGlobalSection("deal", "onlyOne"),
      varbName,
      entityId: Id.make(),
    } as const;
  }
);

export function makeDefaultOutputList(): SectionPack<"outputList"> {
  const outputList = PackBuilderSection.initAsOmniChild("outputList");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    outputList.addChild("outputItem", {
      dbVarbs: { valueEntityInfo: outputVarbInfo },
    });
  }
  return outputList.makeSectionPack();
}
