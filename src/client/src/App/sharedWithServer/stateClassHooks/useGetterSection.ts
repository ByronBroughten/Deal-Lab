import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSection } from "../StateGetters/GetterSection";
import { useSectionsContext } from "./useSections";

export function useGetterSection<SN extends SectionNameByType = "main">(
  props?: FeSectionInfo<SN>
): GetterSection<SN> {
  const { sections } = useSectionsContext();
  return new GetterSection({
    ...(props ?? (sections.mainSectionInfo as FeSectionInfo<SN>)),
    sectionsShare: { sections },
  });
}

export function useGetterSectionOnlyOne<SN extends SectionNameByType>(
  sectionName: SN
): GetterSection<SN> {
  const { sections } = useSectionsContext();
  const { feId } = sections.onlyOneRawSection(sectionName);
  return new GetterSection({
    sectionsShare: { sections },
    sectionName,
    feId,
  });
}
