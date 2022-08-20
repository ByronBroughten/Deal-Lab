import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { useFeUser } from "../sectionActorHooks/useFeUser";
import { auth } from "../services/authService";

function useUpdateOnSubscribe() {
  const feUser = useFeUser();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  React.useEffect(() => {
    async function updateOnSubscribe() {
      if (pathname.endsWith(constants.subscriptionSuccessUrlEnd)) {
        try {
          await feUser.updateSubscriptionData();
        } catch (ex) {
          await signOut();
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
    const { planExp } = feUser.subscriptionValues;
    if (planExp < timeS.now()) {
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
          signOut();
        }
      } else if (pathname.includes(constants.auth.successUrlEnd)) {
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
  const main = useSetterSection();
  return () => {
    auth.removeToken();
    main.resetToDefault();
  };
}
// Ok. Now I'm basically going to do this
// for when a pro subscription expires.
// Will "getUserData" work?

export function useAuthAndLogin() {
  useGetAuthStateIfSessionExists();
  useLogoutIfNoSessionExists();

  const stateToDefault = useStateToDefault();
  async function logout() {
    await signOut();
    stateToDefault();
  }
  return { logout };
}
