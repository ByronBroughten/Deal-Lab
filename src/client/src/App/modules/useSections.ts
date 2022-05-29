import React from "react";
import { defaultMaker } from "../sharedWithServer/Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { StateSections } from "../sharedWithServer/StateSections/StateSectionsNext";
import { react } from "../utils/react";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./SectionsStore";

type UseSectionsProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};
export function useSections({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseSectionsProps = {}) {
  const [sections, setSections] = React.useState(() =>
    initializeSections(prePopulatedSections)
  );

  useLocalSectionsStore({ storeSectionsLocally, sections });

  return {
    sections,
    setSections,
  };
}

type UseSectionsReturn = ReturnType<typeof useSections>;
export type SetSections = UseSectionsReturn["setSections"];

function initializeSections(prePopulatedSections?: StateSections) {
  if (prePopulatedSections) return prePopulatedSections;
  else
    try {
      return SectionsStore.getStoredSections();
    } catch (err) {
      if (err instanceof StateMissingFromStorageError) {
        return defaultMaker.initSectionsFromMain();
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as UseSectionsReturn);
