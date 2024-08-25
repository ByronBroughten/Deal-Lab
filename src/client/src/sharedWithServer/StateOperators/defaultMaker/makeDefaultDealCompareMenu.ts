import { SectionPack } from "../../StateTransports/SectionPack";
import { PackBuilderSection } from "../Packers/PackBuilderSection";

export function makeDefaultDealCompareMenu(): SectionPack<"dealCompareMenu"> {
  const cache = PackBuilderSection.initAsOmniChild("dealCompareMenu");
  cache.addChild("outputList");
  return cache.makeSectionPack();
}
