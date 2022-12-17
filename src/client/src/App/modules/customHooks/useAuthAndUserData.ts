import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";
import { feStoreNameS } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { getErrorMessage } from "../../utils/error";
import { useFeUser } from "../sectionActorHooks/useFeUser";
import { auth } from "../services/authService";

async function authSignOut(): Promise<void> {
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

function useControlLoadUserData() {
  const feUser = useFeUser();
  React.useEffect(() => {
    async function controlUnload() {
      if (await feUser.shouldLoadUserData()) {
        feUser.triggerLoadUserData();
      }
    }
    controlUnload();
  });
}

function useLoadUserData() {
  const feUser = useFeUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function loadUserDataIfTriggered() {
      if (feUser.userDataStatus === "loading") {
        try {
          await feUser.loadUserData();
        } catch (ex) {
          await authSignOut();
          feUser.setter.varb("userDataStatus").updateValue("notLoaded");
          throw new Error(getErrorMessage(ex));
        }
      } else if (pathname.includes(constants.feRoutes.authSuccess)) {
        navigate("/");
      }
    }
    loadUserDataIfTriggered();
  });
}

function useControlUnloadUserData() {
  const feUser = useFeUser();
  React.useEffect(() => {
    async function controlUnload() {
      if (await feUser.shouldUnloadUserData()) {
        feUser.triggerUnloadUserData();
      }
    }
    controlUnload();
  });
}
function useUnloadUserData() {
  const feUser = useFeUser();
  const stateToDefault = useStateToDefault();

  React.useEffect(() => {
    async function syncStateWithSessionLogout() {
      if (
        !(await feUser.sessionExists) &&
        feUser.get.valueNext("userDataStatus") === "loaded"
      ) {
        stateToDefault();
      }
    }
    syncStateWithSessionLogout();
  });
}

function useStateToDefault() {
  const main = useSetterSectionOnlyOne("main");
  return () => {
    auth.removeUserAuthDataToken();
    const feUser = main.onlyChild("feUser");
    feUser.update.removeAllChildrenInArrs(feStoreNameS.arrs.mainStoreName);
    // with the mainStores, I bypass all the solving stuff.
    main.resetToDefault();
  };
}

export function useLogout() {
  const stateToDefault = useStateToDefault();
  return async function logout() {
    await authSignOut();
    stateToDefault();
  };
}

export function useUserData() {
  useControlLoadUserData();
  useLoadUserData();
  useControlUnloadUserData();
  useUnloadUserData();
}
