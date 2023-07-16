import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultDealCompareMenu(): SectionPack<"dealCompareMenu"> {
  const cache = PackBuilderSection.initAsOmniChild("dealCompareMenu");
  cache.addChild("outputList");
  return cache.makeSectionPack();
}
