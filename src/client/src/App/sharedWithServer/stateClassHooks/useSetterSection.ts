import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterSection } from "../StateSetters/SetterSection";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterSection<SN extends SectionName>(
  props: FeSectionInfo<SN>
): SetterSection<SN> {
  const moreProps = useSetterSectionsProps();
  return new SetterSection({
    ...props,
    ...moreProps,
  });
}

export function useSetterSectionMulti<SN extends SectionName>({
  sectionName,
  feIds,
}: {
  sectionName: SN;
  feIds: string[];
}): SetterSection<SN>[] {
  const moreProps = useSetterSectionsProps();
  return feIds.map(
    (feId) =>
      new SetterSection({
        ...moreProps,
        sectionName,
        feId,
      })
  );
}

export function useSetterSectionOnlyOne<SN extends SectionName>(
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
