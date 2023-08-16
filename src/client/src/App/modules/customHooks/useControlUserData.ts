import React from "react";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useQueryAction } from "../../sharedWithServer/stateClassHooks/useQueryAction";
import { authS } from "./authS";

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
