import { useCallback } from "react";
import { useIdOfSectionToSave } from "../../Components/ContextsAndProviders/IdOfSectionToSaveProvider";
import {
  MainStateDispatch,
  useMainDispatch,
} from "../../Components/ContextsAndProviders/MainStateProvider";
import {
  isSavableActionName,
  SectionActionName,
  SectionActionProps,
  StateAction,
} from "../../Components/ContextsAndProviders/MainStateProvider/mainStateReducer";

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
