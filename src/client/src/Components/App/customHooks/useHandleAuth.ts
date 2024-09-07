import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { authS } from "../../../modules/customHooks/authS";
import { useDispatchAndSave } from "../../../stateHooks/useAction";
import { useUserDataStatus } from "../../../stateHooks/useFeStore";
import { useGoToPage } from "./useGoToPage";

export function useHandleAuth() {
  const dispatch = useDispatchAndSave();
  const goToAccountPage = useGoToPage("account");
  const goToAuthPage = useGoToPage("auth");
  const userDataStatus = useUserDataStatus();

  React.useEffect(() => {
    const handleAuth = async () => {
      if (await authS.sessionExists) {
        if (userDataStatus === "notLoaded") {
          unstable_batchedUpdates(() => {
            dispatch({ type: "doLogin" });
            goToAccountPage();
          });
        } else {
          goToAccountPage();
        }
      } else {
        goToAuthPage();
      }
    };
    handleAuth();
  }, []);
}
