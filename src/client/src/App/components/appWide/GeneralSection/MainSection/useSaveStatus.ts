import React from "react";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";

export function useSaveStatus<SN extends SectionNameByType<"hasIndexStore">>(
  feInfo: FeSectionInfo<SN>,
  disable: boolean = false
) {
  const mainSection = useMainSectionActor(feInfo);
  const [saveStatus, setSaveStatus] = React.useState(() =>
    disable ? "unsaved" : mainSection.saveStatus
  );
  React.useEffect(() => {
    let doIt = true && !disable;
    setTimeout(() => {
      if (doIt) {
        setSaveStatus(mainSection.saveStatus);
      }
    }, 700);
    return () => {
      doIt = false;
    };
  });
  return saveStatus;
}
