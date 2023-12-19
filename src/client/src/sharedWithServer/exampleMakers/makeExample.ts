import { SectionPack } from "../SectionPack/SectionPack";
import { DefaultUpdaterSection } from "../StateClasses/DefaultUpdaters/DefaultUpdaterSection";
import { SectionName } from "../sectionVarbsConfig/SectionName";
import { StrictExclude } from "../utils/types";

type OmniChildSn = StrictExclude<SectionName, "root" | "omniParent">;
type PropFn<SN extends OmniChildSn> = (
  updater: DefaultUpdaterSection<SN>
) => void;

export function makeExample<SN extends OmniChildSn>(
  sectionName: SN,
  fn: PropFn<SN>
): SectionPack<SN> {
  const updater = DefaultUpdaterSection.initAsOmniChild(
    sectionName
  ) as DefaultUpdaterSection<SN>;
  fn(updater);
  return updater.makeSectionPack();
}

export function makeExampleMaker<SN extends OmniChildSn>(
  sectionName: SN,
  fn: PropFn<SN>
): () => SectionPack<SN> {
  return () => makeExample(sectionName, fn);
}
