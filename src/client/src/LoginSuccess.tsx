import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "./App/components/customHooks/useGoToPage";
import { useAction } from "./App/sharedWithServer/stateClassHooks/useAction";

export function LoginSuccess() {
  const makeDefaultMain = useAction("makeDefaultMain");
  const goToAccountPage = useGoToPage("account");
  React.useEffect(() => {
    unstable_batchedUpdates(() => {
      makeDefaultMain({});
      goToAccountPage();
    });
  }, []);
  return null;
}
