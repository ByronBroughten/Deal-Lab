import { useCallback } from "react";
import { useIdOfSectionToSave } from "./useIdOfSectionToSave";
import { useSectionsDispatch } from "./useSections";
import {
  isSavableActionName,
  ReducerActionName,
  SectionActionProps,
  SectionsAction,
} from "./useSections/sectionsReducer";

export function useActionWithProps<T extends ReducerActionName>(
  type: T,
  props: SectionActionProps<T>
) {
  const dispatch = useDispatchAndSave();
  return useCallback(
    () =>
      dispatch({
        type,
        ...props,
      } as SectionsAction),
    [type, dispatch, ...Object.values(props)]
  );
}

export function useAction<T extends ReducerActionName>(type: T) {
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

export function useActionNoSave<T extends ReducerActionName>(type: T) {
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
  const sectionId = useIdOfSectionToSave();
  return useCallback(
    (props: SectionsAction) =>
      dispatch({
        ...(isSavableActionName(props.type)
          ? { idOfSectionToSave: sectionId }
          : {}),
        ...props,
      }),
    [dispatch, sectionId]
  );
}
