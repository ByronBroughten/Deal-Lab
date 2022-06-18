import React from "react";
import { react } from "../../utils/react";
import { StateSections } from "../StateSections/StateSections";
import { SolverSections } from "../StateSolvers/SolverSections";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./useSections/SectionsStore";

type UseSectionsProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};
export interface SectionsAndSetSections {
  sections: StateSections;
  setSections: React.Dispatch<React.SetStateAction<StateSections>>;
}
export function useSections({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseSectionsProps = {}): SectionsAndSetSections {
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
        return SolverSections.initSectionsFromDefaultMain();
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as UseSectionsReturn);
