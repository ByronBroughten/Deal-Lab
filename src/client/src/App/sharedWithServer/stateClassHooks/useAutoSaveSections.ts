import React from "react";
import { useActionNoSave } from "./useAction";
import { useGetterFeStore } from "./useFeStore";
import { useQueryAction } from "./useQueryAction";

export function useAutoSaveNext() {
  const feStore = useGetterFeStore();

  const initializeSaveAttempt = useActionNoSave("initializeSaveAttempt");
  const { sectionsToSaveHex, failedSavesString } = feStore;
  React.useEffect(() => {
    if (sectionsToSaveHex || failedSavesString) {
      let timerFunc = setTimeout(() => initializeSaveAttempt({}), 3000);
      return () => clearTimeout(timerFunc);
    }
  }, [sectionsToSaveHex, failedSavesString, initializeSaveAttempt]);

  const preSave = useActionNoSave("preSave");
  const { initializedSaveId } = feStore;
  React.useEffect(() => {
    if (initializedSaveId) {
      preSave({ saveAttemptFeId: initializedSaveId });
    }
  }, [initializedSaveId, preSave]);

  const queryAction = useQueryAction();
  const { pendingSaveId } = feStore;
  const lastIdRef = React.useRef("");
  React.useEffect(() => {
    if (pendingSaveId && lastIdRef.current !== pendingSaveId) {
      queryAction({
        type: "trySaveAttempt",
        feId: pendingSaveId,
      });
      lastIdRef.current = pendingSaveId;
    }
  }, [pendingSaveId, queryAction]);
}
