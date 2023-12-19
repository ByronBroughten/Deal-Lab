import { SectionPack } from "../SectionPacks/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";

export function makeDefaultDealCompareMenu(): SectionPack<"dealCompareMenu"> {
  const cache = PackBuilderSection.initAsOmniChild("dealCompareMenu");
  cache.addChild("outputList");
  return cache.makeSectionPack();
}
