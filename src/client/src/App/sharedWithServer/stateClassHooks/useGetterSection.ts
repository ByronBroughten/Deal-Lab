import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { useFullSectionsContext } from "./useFullSectionsContext";
import { useSectionInfoContext } from "./useSectionContext";

export function useGetterSectionContext() {
  const feInfo = useSectionInfoContext();
  return useGetterSection(feInfo);
}

export function useGetterSection<SN extends SectionName>(
  feInfo: FeSectionInfo<SN>
): GetterSection<SN> {
  const sectionsContext = useFullSectionsContext();
  return new GetterSection({
    ...GetterSections.initProps(sectionsContext),
    ...feInfo,
  });
}

export function useGetterSectionOnlyOne<SN extends SectionNameByType>(
  sectionName: SN
): GetterSection<SN> {
  const { sections, ...rest } = useFullSectionsContext();
  const { feId } = sections.onlyOneRawSection(sectionName);
  return new GetterSection({
    ...GetterSections.initProps({
      sections,
      ...rest,
    }),
    sectionName,
    feId,
  });
}
