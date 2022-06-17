import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionsProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { MainSectionActor } from "../SectionActors/MainSectionActor";
import { apiQueries } from "../useQueryActionsTest/apiQueriesClient";
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
  }, [JSON.stringify(feInfo)]);
  // how do I want to handle this?
  // I guess I do want the SectionActor
  // to chnage if the feInfo changes
  // but that's an equality check, right?

  // ok, so feInfo changed, but mainActor didn't.
  useUpdateSetterSections(mainActor);
  return mainActor;
}
