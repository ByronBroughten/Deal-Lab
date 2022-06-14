import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { MainSectionActor } from "../SectionActors/MainSectionActor";
import { apiQueries } from "../useQueryActions/apiQueriesClient";
import { useUpdateSetterSections } from "./useUpdateSetterSections";

export function useMainSectionActor<SN extends SectionName<"hasRowIndex">>(
  feInfo: FeSectionInfo<SN>
): MainSectionActor<SN> {
  const props = useSetterSectionsProps();
  const mainActor = React.useMemo(() => {
    return new MainSectionActor({
      ...feInfo,
      ...props,
      apiQueries,
    });
  }, []);
  useUpdateSetterSections(mainActor);
  return mainActor;
}