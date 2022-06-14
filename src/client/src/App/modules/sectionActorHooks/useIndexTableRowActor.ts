import React from "react";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { IndexTableRowActor } from "../SectionActors/IndexTableRowActor";
import { useUpdateSetterSections } from "./useUpdateSetterSections";

export type UseIndexTableRowActorProps = {
  feId: string;
  indexName: SectionName<"rowIndexNext">;
};
export function useIndexTableRowActor(
  indexInfo: UseIndexTableRowActorProps
): IndexTableRowActor {
  const moreProps = useSectionsActorProps();
  const indexRowActor = React.useMemo(() => {
    return new IndexTableRowActor({
      ...indexInfo,
      ...moreProps,
    });
  }, [JSON.stringify(indexInfo)]);
  useUpdateSetterSections(indexRowActor);
  return indexRowActor;
}
