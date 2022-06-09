import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { MainSectionActor } from "../SectionActors/MainSectionActor";

export function useMainSectionActor<SN extends SectionName<"hasRowIndex">>(
  feInfo: FeSectionInfo<SN>
): MainSectionActor<SN> {
  const { sections, setSections } = useSectionsContext();
  const mainActor = React.useMemo(() => {
    return new MainSectionActor({
      ...feInfo,
      setSections,
      sectionsShare: { sections },
    });
  }, []);
  React.useEffect(() => {
    mainActor.updateSetterProps({ sections, setSections });
  }, [sections, setSections]);
  return mainActor;
}
