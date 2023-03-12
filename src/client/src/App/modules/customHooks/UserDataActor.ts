import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/appWide/customHooks/useGoToPage";
import { QueryRes } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSectionOnlyOneProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { getErrorMessage } from "../../utils/error";
import { apiQueries } from "../apiQueriesClient";
import { UserDataSolver } from "../SectionActors/FeUserActor/UserDataSolver";
import {
  SectionActorBase,
  SectionActorBaseProps,
} from "../SectionActors/SectionActorBase";
import { userTokenS } from "../services/userTokenS";
import { authS } from "./authS";

export function useUserDataActor(): UserDataActor {
  const sectionProps = useSetterSectionOnlyOneProps("feUser");
  const goToAuthPage = useGoToPage("auth");
  return new UserDataActor({
    ...sectionProps,
    goToAuthPage,
    apiQueries: apiQueries,
  });
}

interface Props extends SectionActorBaseProps<"feUser"> {
  goToAuthPage: () => void;
}

export class UserDataActor extends SectionActorBase<"feUser"> {
  private goToAuthPage: () => void;
  constructor({ goToAuthPage, ...rest }: Props) {
    super(rest);
    this.goToAuthPage = goToAuthPage;
  }

  get userDataSolver(): UserDataSolver {
    return new UserDataSolver(this.sectionActorBaseProps);
  }
  private get mainSetter() {
    return SetterSection.initOnlyOne({
      ...this.setterSectionBase.setterSectionsProps,
      sectionName: "main",
    });
  }
  private get setter(): SetterSection<"feUser"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get userDataStatus(): StateValue<"userDataStatus"> {
    return this.get.valueNext("userDataStatus");
  }
  updateUserDataStatus(userDataStatus: StateValue<"userDataStatus">): void {
    this.setter.updateValues({ userDataStatus });
  }
  async controlUserData(): Promise<void> {
    if (await this.shouldTriggerLoad()) {
      return this.updateUserDataStatus("loading");
    }
    if (await this.shouldTriggerUnload()) {
      return await this.unloadUserData();
    }
  }
  async tryLoadUserData() {
    try {
      await this.loadUserData();
    } catch (ex) {
      await this.unloadUserData();
      throw new Error(getErrorMessage(ex));
    }
  }
  private async shouldTriggerLoad(): Promise<boolean> {
    return this.userDataStatus === "notLoaded" && (await authS.sessionExists);
  }
  private async shouldTriggerUnload(): Promise<boolean> {
    return this.userDataStatus === "loaded" && !(await authS.sessionExists);
  }
  async loadUserData(): Promise<void> {
    const res = await this.apiQueries.getUserData(makeReq({}));
    this.setUserData(res);
  }
  private setUserData({ data, headers }: QueryRes<"getUserData">) {
    userTokenS.setTokenFromHeaders(headers);
    this.userDataSolver.loadUserData(data);
    this.setter.setSections();
  }
  async unloadUserData(): Promise<void> {
    userTokenS.removeUserAuthDataToken();
    unstable_batchedUpdates(async () => {
      await authS.endSession();
      this.mainSetter.resetToDefault();
      this.goToAuthPage();
    });
  }
}

export function useControlUserData() {
  const userDataActor = useUserDataActor();
  const { userDataStatus } = userDataActor;

  React.useEffect(() => {
    userDataActor.controlUserData();
  });

  React.useEffect(() => {
    if (userDataStatus === "loading") {
      userDataActor.tryLoadUserData();
    }
  }, [userDataStatus]);
}

export function useLogout() {
  const userDataActor = useUserDataActor();
  return async function logout() {
    await userDataActor.unloadUserData();
  };
}
