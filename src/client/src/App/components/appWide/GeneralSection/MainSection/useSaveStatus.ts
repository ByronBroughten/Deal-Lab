import React from "react";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SaveStatus } from "../../../../modules/SectionSolvers/MainSectionSolver";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";

export function useSaveStatus<SN extends SectionNameByType<"hasIndexStore">>(
  feInfo: FeSectionInfo<SN>,
  disable: boolean = false
): SaveStatus {
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
