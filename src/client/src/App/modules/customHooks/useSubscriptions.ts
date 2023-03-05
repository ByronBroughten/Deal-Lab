import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { constants } from "../../Constants";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { getErrorMessage } from "../../utils/error";
import { useFeUser } from "../sectionActorHooks/useFeUser";

export function useSubscriptions() {
  useUpdateOnSubscribe();
  useUpdateOnExpire();
}

export function useUserSubscription(): {
  userPlan: StateValue<"labSubscription">;
  userPlanExpiration: number;
  userIsPro: boolean;
} {
  const user = useGetterSectionOnlyOne("feUser");
  const userPlan = user.valueNext("labSubscription");
  const userPlanExpiration = user.valueNext("labSubscriptionExp");
  return {
    userPlan,
    userPlanExpiration,
    userIsPro: userPlan === "fullPlan",
  };
}

function useUpdateOnSubscribe() {
  const feUser = useFeUser();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  React.useEffect(() => {
    async function updateOnSubscribe() {
      if (pathname.endsWith(constants.feRoutes.subscribeSuccess)) {
        try {
          await feUser.updateSubscriptionData();
        } catch (ex) {
          throw new Error(getErrorMessage(ex));
        }
        navigate("/");
      }
    }
    updateOnSubscribe();
  });
}

function useUpdateOnExpire() {
  const feUser = useFeUser();
  const { userPlanExpiration } = useUserSubscription();

  React.useEffect(() => {
    if (userPlanExpiration < timeS.now()) {
      feUser.updateSubscriptionData();
    }
  });
}
