import { useSectionsContext } from "../../Components/ContextsAndProviders/MainStateProvider";
import { useSectionInfoContext } from "../../Components/ContextsAndProviders/SectionInfoContextProvider";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { FeSectionInfo } from "../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../sharedWithServer/stateSchemas/schema2SectionNames";
import { SectionNameByType } from "../../sharedWithServer/stateSchemas/schema6SectionChildren/SectionNameByType";

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
