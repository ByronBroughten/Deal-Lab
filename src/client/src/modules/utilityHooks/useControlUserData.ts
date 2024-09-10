import React from "react";
import { authS } from "../services/authS";
import { useGetterFeStore } from "../stateHooks/useFeStore";
import { useQueryAction } from "../stateHooks/useQueryAction";

export function useControlUserData() {
  const queryAction = useQueryAction();
  const feStore = useGetterFeStore();

  const userDataStatus = feStore.get.valueNext("userDataStatus");
  React.useEffect(() => {
    const controlManualLogout = async () => {
      if (userDataStatus === "loaded" && !(await authS.sessionExists)) {
        queryAction({ type: "logout" });
      }
    };
    controlManualLogout();
  });

  const userDataFetchTryCount = feStore.get.valueNext("userDataFetchTryCount");
  const fetchCountRef = React.useRef(null as null | number);
  React.useEffect(() => {
    const doLoginAttempts = () => {
      if (userDataFetchTryCount > 5) {
        queryAction({ type: "logout" });
      } else if (
        userDataStatus === "loading" &&
        fetchCountRef.current !== userDataFetchTryCount
      ) {
        fetchCountRef.current = userDataFetchTryCount;
        queryAction({ type: "loadUserData" });
      }
    };
    doLoginAttempts();
  }, [userDataStatus, userDataFetchTryCount, queryAction]);
}
