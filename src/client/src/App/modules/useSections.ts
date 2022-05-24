import React from "react";
import { FeSections } from "../sharedWithServer/SectionsState/SectionsState";
import { react } from "../utils/react";
import {
  SectionsStore,
  StateMissingFromStorageError,
} from "./storedSectionsState";

export function useSections(prePopulatedSections?: FeSections) {
  const [sections, setSections] = React.useState(() =>
    initializeSections(prePopulatedSections)
  );
  return {
    sections,
    setSections,
  };
}

type UseSectionsReturn = ReturnType<typeof useSections>;
export type SetSections = UseSectionsReturn["setSections"];

function initializeSections(prePopulatedSections?: FeSections) {
  if (prePopulatedSections) return prePopulatedSections;
  else
    try {
      return SectionsStore.getStoredSections();
    } catch (err) {
      if (err instanceof StateMissingFromStorageError) {
        return FeSections.init();
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as UseSectionsReturn);
