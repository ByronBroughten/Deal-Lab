import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { apiQueries } from "../apiQueriesClient";
import { TableActor } from "../SectionActors/TableActor";

export function useTableActor(feId: string, sendTable: () => void = () => {}) {
  const props = useSetterSectionsProps();
  return new TableActor({
    ...props,
    apiQueries,
    sendTable,
    feId,
  });
}
