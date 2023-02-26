import { useCallback } from "react";
import {
  FeSectionInfo,
  FeVarbValueInfo,
} from "../SectionsMeta/SectionInfo/FeInfo";
import { useSectionsDispatch } from "./useSections";
import { VarbContentInfo } from "./useSections/sectionsReducer";

export function useUpdateValue() {
  const dispatch = useSectionsDispatch();
  return useCallback(
    (valueInfo: FeVarbValueInfo) =>
      dispatch({
        type: "updateValue",
        ...valueInfo,
      }),
    [dispatch]
  );
}

export function useRemoveSelf() {
  const dispatch = useSectionsDispatch();
  return useCallback(
    (feInfo: FeSectionInfo) =>
      dispatch({
        type: "removeSelf",
        ...feInfo,
      }),
    [dispatch]
  );
}

export function useUpdateValueFromContent() {
  const dispatch = useSectionsDispatch();
  return useCallback(
    (contentInfo: VarbContentInfo) =>
      dispatch({
        type: "updateValueFromContent",
        ...contentInfo,
      }),
    [dispatch]
  );
}
