import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { TableActor } from "../SectionActors/TableActor";
import { apiQueries } from "../useQueryActionsTest/apiQueriesClient";

export function useTableActor(feId: string, sendTable: () => void = () => {}) {
  const props = useSetterSectionsProps();
  return new TableActor({
    ...props,
    apiQueries,
    sendTable,
    feId,
  });
}
