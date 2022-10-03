import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { IndexTableRowActor } from "../SectionActors/IndexTableRowActor";
import { apiQueries } from "./../apiQueriesClient";

export interface UseIndexTableRowActorProps {
  feId: string;
}
export function useIndexTableRowActor(
  indexInfo: UseIndexTableRowActorProps
): IndexTableRowActor {
  const props = useSetterSectionsProps();
  return new IndexTableRowActor({
    apiQueries,
    ...indexInfo,
    ...props,
  });
}
