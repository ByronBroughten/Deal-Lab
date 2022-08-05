import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { useFeUser } from "../sectionActorHooks/useFeUser";
import { auth } from "../services/authService";

export function useAuthAndLogin() {
  const main = useSetterSection();
  const feUser = useFeUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    async function syncStateWithSessionLogin() {
      if ((await feUser.sessionExists) && feUser.authStatus === "guest") {
        feUser.loadUserData();
      } else if (pathname.includes(constants.auth.successUrlEnd)) {
        navigate("/");
      }
    }
    syncStateWithSessionLogin();
  });

  async function stateToDefault() {
    auth.removeToken();
    main.resetToDefault();
  }
  async function logout() {
    await signOut();
    stateToDefault();
  }

  React.useEffect(() => {
    async function syncStateWithSessionExpiration() {
      if (!(await feUser.sessionExists)) {
        if (feUser.authStatus !== "guest") {
          stateToDefault();
        }
      }
    }
    syncStateWithSessionExpiration();
  });
  return {
    logout,
  };
}
