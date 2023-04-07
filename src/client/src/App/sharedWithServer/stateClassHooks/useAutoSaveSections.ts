import React from "react";
import { constants } from "../../Constants";
import { useActionNoSave } from "./useAction";
import { useGetterFeStore } from "./useFeStore";
import { useQueryAction } from "./useQueryAction";

export function useAutoSaveNext() {
  const feStore = useGetterFeStore();

  const onChangeIdle = useActionNoSave("onChangeIdle");
  const { noneSaving, timeOfLastChange } = feStore;
  React.useEffect(() => {
    if (noneSaving) {
      let timerFunc = setTimeout(
        () => onChangeIdle({}),
        constants.saveDelayInMs
      );
      return () => clearTimeout(timerFunc);
    }
  }, [noneSaving, timeOfLastChange, onChangeIdle]);

  const queryAction = useQueryAction();
  const { timeOfSave } = feStore;
  const lastIdRef = React.useRef(timeOfSave);
  React.useEffect(() => {
    if (timeOfSave && lastIdRef.current !== timeOfSave) {
      lastIdRef.current = timeOfSave;
      queryAction({ type: "trySave" });
    }
  }, [timeOfSave, queryAction]);
}
