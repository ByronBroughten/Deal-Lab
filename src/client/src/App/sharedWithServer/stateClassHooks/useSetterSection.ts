import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterSection } from "../StateSetters/SetterSection";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterSection<SN extends SectionName = "main">(
  props?: FeSectionInfo<SN>
): SetterSection<SN> {
  const moreProps = useSetterSectionsProps();
  const { sections } = moreProps.sectionsShare;
  return new SetterSection({
    ...(props ?? (sections.mainSectionInfo as FeSectionInfo<SN>)),
    ...moreProps,
  });
}
