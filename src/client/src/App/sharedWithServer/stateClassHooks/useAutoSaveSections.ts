import React from "react";
import { constants } from "../../Constants";
import { useActionNoSave } from "./useAction";
import { useGetterFeStore } from "./useFeStore";
import { useQueryAction } from "./useQueryAction";

export function useAutoSave() {
  const feStore = useGetterFeStore();

  const onChangeIdle = useActionNoSave("onChangeIdle");
  const { noneSaving, timeOfLastChange, currentChangesFailedToSave } = feStore;
  React.useEffect(() => {
    if (timeOfLastChange && noneSaving && !currentChangesFailedToSave) {
      let timerFunc = setTimeout(
        () => onChangeIdle({}),
        constants.saveDelayInMs
      );
      return () => clearTimeout(timerFunc);
    }
  }, [timeOfLastChange, noneSaving, currentChangesFailedToSave, onChangeIdle]);

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
