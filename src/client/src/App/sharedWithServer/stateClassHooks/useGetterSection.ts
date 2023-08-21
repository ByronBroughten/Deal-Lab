import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { useSectionsContext } from "./useMainState";
import { useSectionInfoContext } from "./useSectionContext";

export function useGetterSectionContext() {
  const feInfo = useSectionInfoContext();
  return useGetterSection(feInfo);
}

export function useGetterSection<SN extends SectionName>(
  feInfo: FeSectionInfo<SN>
): GetterSection<SN> {
  const sections = useSectionsContext();
  return new GetterSection({
    ...GetterSections.initProps({ sections }),
    ...feInfo,
  });
}

export function useGetterSectionMulti<SN extends SectionName>(
  sectionName: SN,
  feIds: string[]
): GetterSection<SN>[] {
  const sections = useSectionsContext();
  return feIds.map(
    (feId) =>
      new GetterSection({
        ...GetterSections.initProps({ sections }),
        sectionName,
        feId,
      })
  );
}

export function useGetterSectionOnlyOne<SN extends SectionNameByType>(
  sectionName: SN
): GetterSection<SN> {
  const sections = useSectionsContext();
  const { feId } = sections.onlyOneRawSection(sectionName);
  return new GetterSection({
    ...GetterSections.initProps({ sections }),
    sectionName,
    feId,
  });
}
