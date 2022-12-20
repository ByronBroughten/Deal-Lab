import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { SetterSection } from "../StateSetters/SetterSection";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterSection<SN extends SectionNameByType>(
  props: FeSectionInfo<SN>
): SetterSection<SN> {
  const moreProps = useSetterSectionsProps();
  return new SetterSection({
    ...props,
    ...moreProps,
  });
}

export function useSetterSectionOnlyOne<SN extends SectionNameByType>(
  sectionName: SN
): SetterSection<SN> {
  const props = useSetterSectionsProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection(sectionName);
  return new SetterSection({
    ...props,
    sectionName,
    feId,
  });
}
