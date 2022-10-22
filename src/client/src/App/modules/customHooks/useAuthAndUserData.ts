import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { getErrorMessage } from "../../utils/error";
import { useFeUser } from "../sectionActorHooks/useFeUser";
import { auth } from "../services/authService";

async function signOutWrapper(): Promise<void> {
  return signOut();
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
          await signOutWrapper();
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
  React.useEffect(() => {
    const { analyzerPlanExp } = feUser.subscriptionValues;
    if (analyzerPlanExp < timeS.now()) {
      feUser.updateSubscriptionData();
    }
  });
}

export function useSubscriptionState() {
  useUpdateOnSubscribe();
  useUpdateOnExpire();
}

function useGetAuthStateIfSessionExists() {
  const feUser = useFeUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function syncStateWithSessionLogin() {
      if ((await feUser.sessionExists) && feUser.authStatus === "guest") {
        try {
          await feUser.loadUserData();
        } catch (ex) {
          await signOutWrapper();
          throw new Error(getErrorMessage(ex));
        }
      } else if (pathname.includes(constants.feRoutes.authSuccess)) {
        navigate("/");
      }
    }
    syncStateWithSessionLogin();
  });
}

function useLogoutIfNoSessionExists() {
  const feUser = useFeUser();
  const stateToDefault = useStateToDefault();

  React.useEffect(() => {
    async function syncStateWithSessionLogout() {
      if (!(await feUser.sessionExists) && feUser.authStatus !== "guest") {
        stateToDefault();
      }
    }
    syncStateWithSessionLogout();
  });
}

function useStateToDefault() {
  const main = useSetterSectionOnlyOne("main");
  return () => {
    auth.removeToken();
    main.resetToDefault();
  };
}

export function useAuthAndLogin() {
  useGetAuthStateIfSessionExists();
  useLogoutIfNoSessionExists();

  const stateToDefault = useStateToDefault();
  async function logout() {
    await signOutWrapper();
    stateToDefault();
  }
  return { logout };
}
