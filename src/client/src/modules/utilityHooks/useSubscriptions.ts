import React from "react";
import { useLocation } from "react-router-dom";
import { useGoToPage } from "../../Components/App/customHooks/useGoToPage";
import { constants } from "../../sharedWithServer/Constants";
import { StateValue } from "../../sharedWithServer/stateSchemas/StateValue";
import { getErrorMessage } from "../../sharedWithServer/utils/Error";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { useGetterSectionOnlyOne } from "../stateHooks/useGetterSection";
import { useQueryAction } from "../stateHooks/useQueryAction";

export function useSubscriptions() {
  useUpdateOnSubscribe();
  useUpdateOnExpire();
}

export function useUserSubscription(): {
  userPlan: StateValue<"labSubscription">;
  userPlanExpiration: number;
  userIsPro: boolean;
} {
  const user = useGetterSectionOnlyOne("feStore");
  const userPlan = user.valueNext("labSubscription");
  const userPlanExpiration = user.valueNext("labSubscriptionExp");
  return {
    userPlan,
    userPlanExpiration,
    userIsPro: userPlan === "fullPlan",
  };
}

function useUpdateOnSubscribe() {
  const queryAction = useQueryAction();

  const { pathname } = useLocation();

  const goToAccount = useGoToPage("account");
  React.useEffect(() => {
    async function updateOnSubscribe() {
      if (pathname.endsWith(constants.feRoutes.subscribeSuccess)) {
        try {
          queryAction({ type: "updateSubscriptionData" });
        } catch (ex) {
          throw new Error(getErrorMessage(ex));
        }
        goToAccount();
      }
    }
    updateOnSubscribe();
  });
}

function useUpdateOnExpire() {
  const queryAction = useQueryAction();
  const { userPlanExpiration } = useUserSubscription();

  React.useEffect(() => {
    if (userPlanExpiration < timeS.now()) {
      queryAction({ type: "updateSubscriptionData" });
    }
  });
}
