import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";

import { useSectionInfoContext } from "./useSectionContext";
import { useSectionsContext } from "./useSections";

export function useGetterSectionContext() {
  const feInfo = useSectionInfoContext();
  return useGetterSection(feInfo);
}

export function useGetterSection<SN extends SectionName>(
  feInfo: FeSectionInfo<SN>
): GetterSection<SN> {
  const sectionsContext = useSectionsContext();
  return new GetterSection({
    ...GetterSections.initProps(sectionsContext),
    ...feInfo,
  });
}

export function useGetterSectionOnlyOne<SN extends SectionNameByType>(
  sectionName: SN
): GetterSection<SN> {
  const { sections } = useSectionsContext();
  const { feId } = sections.onlyOneRawSection(sectionName);
  return new GetterSection({
    ...GetterSections.initProps({ sections }),
    sectionName,
    feId,
  });
}
