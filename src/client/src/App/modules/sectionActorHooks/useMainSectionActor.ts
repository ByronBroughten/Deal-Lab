import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { apiQueries } from "../apiQueriesClient";
import { MainSectionActor } from "../SectionActors/MainSectionActor";

export function useMainSectionActor<SN extends SectionName<"hasIndexStore">>(
  feInfo: FeSectionInfo<SN>
): MainSectionActor<SN> {
  const props = useSetterSectionsProps();
  return new MainSectionActor({
    ...feInfo,
    ...props,
    apiQueries,
  });
}
