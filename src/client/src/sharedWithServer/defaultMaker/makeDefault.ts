import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { SectionName } from "../sectionVarbsConfig/SectionName";
import { StrictExclude } from "../utils/types";

type OmniChildSn = StrictExclude<SectionName, "root" | "omniParent">;
type PropFn<SN extends OmniChildSn> = (
  packBuilder: PackBuilderSection<SN>
) => void;

export function makeDefault<SN extends OmniChildSn>(
  sectionName: SN,
  fn: PropFn<SN>
): SectionPack<SN> {
  const packBuilder = PackBuilderSection.initAsOmniChild(
    sectionName
  ) as PackBuilderSection<SN>;
  fn(packBuilder);
  return packBuilder.makeSectionPack();
}

export function makeDefaultMaker<SN extends OmniChildSn>(
  sectionName: SN,
  fn: PropFn<SN>
): () => SectionPack<SN> {
  return () => makeDefault(sectionName, fn);
}
