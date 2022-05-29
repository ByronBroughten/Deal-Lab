import React from "react";
import { StateSections } from "../sharedWithServer/StateSections/StateSectionsNext";
import { SolverSection } from "../sharedWithServer/StateSolvers/SolverSection";
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
        return SolverSection.initSectionsFromDefaultMain();
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as UseSectionsReturn);
