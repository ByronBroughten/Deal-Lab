import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { useSectionsContext } from "./useSections";

export function useGetterSection<SN extends SectionName = "main">(
  props?: FeSectionInfo<SN>
): GetterSection<SN> {
  const { sections } = useSectionsContext();
  return new GetterSection({
    ...(props ?? (sections.mainSectionInfo as FeSectionInfo<SN>)),
    sectionsShare: { sections },
  });
}
