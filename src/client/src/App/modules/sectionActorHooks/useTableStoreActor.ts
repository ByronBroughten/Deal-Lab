import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { TableStoreActor } from "../SectionActors/TableStoreActor";
import { apiQueries } from "../useQueryActionsTest/apiQueriesClient";
import { useUpdateSetterSections } from "./useUpdateSetterSections";

export function useTableStoreActor<SN extends SectionName<"tableStore">>({
  feId,
  sectionName,
}: FeSectionInfo<SN>): TableStoreActor<SN> {
  const props = useSetterSectionsProps();
  const tableActor = React.useMemo(() => {
    return new TableStoreActor({
      ...props,
      sectionName,
      feId,
      apiQueries,
    });
  }, [feId, sectionName]);
  useUpdateSetterSections(tableActor);
  return tableActor;
}
