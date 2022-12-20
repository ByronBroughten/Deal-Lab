import { useCallback } from "react";
import {
  FeSectionInfo,
  FeVarbValueInfo,
} from "../SectionsMeta/SectionInfo/FeInfo";
import { useSectionContextName } from "./useSectionContextName";
import { useSectionsDispatch } from "./useSections";
import { VarbContentInfo } from "./useSections/sectionsReducer";

export function useUpdateValue() {
  const dispatch = useSectionsDispatch();
  const sectionContextName = useSectionContextName();
  return useCallback(
    (valueInfo: FeVarbValueInfo) =>
      dispatch({
        type: "updateValue",
        sectionContextName,
        ...valueInfo,
      }),
    [dispatch, sectionContextName]
  );
}

export function useRemoveSelf() {
  const dispatch = useSectionsDispatch();
  const sectionContextName = useSectionContextName();
  return useCallback(
    (feInfo: FeSectionInfo) =>
      dispatch({
        type: "removeSelf",
        sectionContextName,
        ...feInfo,
      }),
    [dispatch, sectionContextName]
  );
}

export function useUpdateValueFromContent() {
  const dispatch = useSectionsDispatch();
  const sectionContextName = useSectionContextName();
  return useCallback(
    (contentInfo: VarbContentInfo) =>
      dispatch({
        type: "updateValueFromContent",
        sectionContextName,
        ...contentInfo,
      }),
    [dispatch, sectionContextName]
  );
}
