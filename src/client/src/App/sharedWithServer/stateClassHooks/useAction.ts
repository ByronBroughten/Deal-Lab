import { useCallback } from "react";
import { useIdOfSectionToSave } from "./useIdOfSectionToSave";
import { useSectionsDispatch } from "./useSections";
import {
  isSavableActionName,
  SectionActionName,
  SectionActionProps,
  SectionsAction,
} from "./useSections/sectionsReducer";

export function useActionWithProps<T extends SectionActionName>(
  type: T,
  props: SectionActionProps<T>
) {
  const dispatch = useDispatchAndSave();
  return () =>
    dispatch({
      type,
      ...props,
    } as SectionsAction);
}

export function useAction<T extends SectionActionName>(type: T) {
  const dispatch = useDispatchAndSave();
  return useCallback(
    (props: SectionActionProps<T>) =>
      dispatch({
        type,
        ...props,
      } as SectionsAction),
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
      } as SectionsAction),
    [dispatch]
  );
}

export function useDispatchAndSave(): (props: SectionsAction) => void {
  const dispatch = useSectionsDispatch();
  const storeId = useIdOfSectionToSave();
  return useCallback(
    (props: SectionsAction) =>
      dispatch({
        ...(isSavableActionName(props.type)
          ? { idOfSectionToSave: storeId }
          : {}),
        ...props,
      }),
    [dispatch, storeId]
  );
}
