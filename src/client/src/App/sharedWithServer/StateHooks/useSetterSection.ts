import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterSection } from "../StateSetters/SetterSection";
import { useSectionsContext } from "./useSections";

export function useSetterSection<SN extends SectionName = "main">(
  props?: FeSectionInfo<SN>
): SetterSection<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SetterSection({
    ...(props ?? (sections.mainSectionInfo as FeSectionInfo<SN>)),
    setSections,
    sectionsShare: { sections },
  });
}
