import React from "react";
import { react } from "../../utils/react";
import { StateSections } from "../StateSections/StateSections";
import { SolverSections } from "../StateSolvers/SolverSections";
import { StrictOmit } from "../utils/types";
import { SectionsAction, sectionsReducer } from "./useSections/sectionsReducer";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./useSections/SectionsStore";

export type SetSections = React.Dispatch<React.SetStateAction<StateSections>>;
type UseSectionsProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};
export interface SectionsAndControls {
  sectionsDispatch: React.Dispatch<SectionsAction>;
  sections: StateSections;
  setSections: React.Dispatch<React.SetStateAction<StateSections>>;
}
export function useSections({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseSectionsProps = {}): SectionsAndControls {
  const [sections, sectionsDispatch] = React.useReducer(
    sectionsReducer,
    StateSections.initEmpty(),
    () => initializeSections(prePopulatedSections)
  );
  const setSections: SetSections = (value) => {
    if (value instanceof StateSections)
      sectionsDispatch({
        type: "setState",
        sections: value,
      });
    else {
      sectionsDispatch({
        type: "setState",
        sections: value(sections),
      });
    }
  };

  useLocalSectionsStore({ storeSectionsLocally, sections });

  return {
    sectionsDispatch,
    sections,
    setSections,
  };
}

type UseSectionsReturn = ReturnType<typeof useSections>;
export type SectionsValue = StrictOmit<UseSectionsReturn, "sectionsDispatch">;
export type SectionsDispatch = UseSectionsReturn["sectionsDispatch"];

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
  react.makeContextUseContext("SectionContext", {} as SectionsValue);

export const [SectionsDispatchContext, useSectionsDispatch] =
  react.makeContextUseContext(
    "SectionsDispatchContext",
    {} as SectionsDispatch
  );
