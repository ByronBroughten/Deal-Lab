import { useCallback } from "react";
import { useIdOfSectionToSave } from "../ContextsAndProviders/useIdOfSectionToSave";
import {
  MainStateDispatch,
  useMainDispatch,
} from "../ContextsAndProviders/useMainState";
import {
  isSavableActionName,
  SectionActionName,
  SectionActionProps,
  StateAction,
} from "../ContextsAndProviders/useMainState/mainStateReducer";

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
  const dispatch = useMainDispatch();
  return useCallback(
    (props: SectionActionProps<T>) =>
      dispatch({
        type,
        ...props,
      } as StateAction),
    [dispatch]
  );
}

export function useDispatchAndSave(): MainStateDispatch {
  const dispatch = useMainDispatch();
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
