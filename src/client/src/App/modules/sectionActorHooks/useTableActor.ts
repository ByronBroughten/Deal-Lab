import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { TableActor } from "../SectionActors/TableActor";
import { apiQueries } from "../useQueryActions/apiQueriesClient";
import { useUpdateSetterSections } from "./useUpdateSetterSections";

export function useTableActor<SN extends SectionName<"tableName">>(
  feInfo: FeSectionInfo<SN>
): TableActor<SN> {
  const props = useSetterSectionsProps();
  const tableActor = React.useMemo(() => {
    return new TableActor({
      ...feInfo,
      ...props,
      apiQueries,
    });
  }, [JSON.stringify(feInfo)]);
  useUpdateSetterSections(tableActor);
  return tableActor;
}
