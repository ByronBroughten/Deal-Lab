import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { apiQueries } from "../apiQueriesClient";
import { MainSectionActor } from "../SectionActors/MainSectionActor";

export function useMainSectionActor<
  SN extends SectionNameByType<"hasIndexStore">
>(feInfo: FeSectionInfo<SN>): MainSectionActor<SN> {
  const props = useSetterSectionsProps();
  return new MainSectionActor({
    ...feInfo,
    ...props,
    apiQueries,
  });
}
