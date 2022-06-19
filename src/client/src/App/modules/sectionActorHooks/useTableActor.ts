import React from "react";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { TableActor } from "../SectionActors/TableActor";
import { apiQueries } from "../useQueryActionsTest/apiQueriesClient";
import { useUpdateSetterSections } from "./useUpdateSetterSections";

export function useTableActor(feId: string): TableActor {
  const props = useSetterSectionsProps();
  const tableActor = React.useMemo(() => {
    return new TableActor({
      feId,
      ...props,
      apiQueries,
    });
  }, [JSON.stringify(feId)]);
  useUpdateSetterSections(tableActor);
  return tableActor;
}
