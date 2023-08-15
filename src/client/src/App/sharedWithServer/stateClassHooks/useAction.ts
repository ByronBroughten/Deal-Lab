import { useCallback } from "react";
import { useIdOfSectionToSave } from "./useIdOfSectionToSave";
import { SectionsDispatch, useSectionsDispatch } from "./useSections";
import {
  isSavableActionName,
  SectionActionName,
  SectionActionProps,
  StateAction,
} from "./useSections/sectionsReducer";

export function useActionWithProps<T extends SectionActionName>(
  type: T,
  props: SectionActionProps<T>
) {
  // for some reason, this doesn't work with collecting storeIds
  // of sections to save
  const dispatch = useDispatchAndSave();
  return () =>
    dispatch({
      type,
      ...props,
    } as StateAction);
}

export function useAction<T extends SectionActionName>(
  type: T
): (props: SectionActionProps<T>) => void {
  const dispatch = useDispatchAndSave();
  return useCallback(
    (props: SectionActionProps<T>) =>
      dispatch({
        type,
        ...props,
      } as StateAction),
    [type, dispatch]
  );
}

export function useActionNoSave<T extends SectionActionName>(type: T) {
  const dispatch = useSectionsDispatch();
  return useCallback(
    (props: SectionActionProps<T>) =>
      dispatch({
        type,
        ...props,
      } as StateAction),
    [dispatch]
  );
}

export function useDispatchAndSave(): SectionsDispatch {
  const dispatch = useSectionsDispatch();
  const storeId = useIdOfSectionToSave();
  return useCallback(
    (props: StateAction) =>
      dispatch({
        ...(isSavableActionName(props.type)
          ? { idOfSectionToSave: storeId }
          : {}),
        ...props,
      }),
    [dispatch, storeId]
  );
}
