import { DbStoreNameByType } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { apiQueries } from "../apiQueriesClient";
import { TableActor } from "../SectionActors/TableActor";

export type UseTableActorProps = {
  feId: string;
  rowSourceName: DbStoreNameByType<"mainIndex">;
};
export function useTableActor(props: UseTableActorProps) {
  const props2 = useSetterSectionsProps();
  return new TableActor({
    apiQueries,
    ...props2,
    ...props,
  });
}
