import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/appWide/customHooks/useGoToPage";
import { QueryRes } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { useQueryAction } from "../../sharedWithServer/stateClassHooks/useQueryAction";
import { useSetterSectionOnlyOneProps } from "../../sharedWithServer/stateClassHooks/useSetterSectionsProps";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { getErrorMessage } from "../../utils/error";
import { apiQueries } from "../apiQueriesClient";
import { authS } from "../customHooks/authS";
import { userTokenS } from "../services/userTokenS";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";
import { UserDataSolver } from "./UserDataSolver";

export function useUserDataActor(): UserDataActor {
  const sectionProps = useSetterSectionOnlyOneProps("feStore");
  const goToAuthPage = useGoToPage("auth");
  const goToAccountPage = useGoToPage("account");
  return new UserDataActor({
    ...sectionProps,
    goToAuthPage,
    goToAccountPage,
    apiQueries,
  });
}

export function useUserDataStatus(): StateValue<"userDataStatus"> {
  const { userDataStatus } = useUserDataActor();
  return userDataStatus;
}

interface Props extends SectionActorBaseProps<"feStore"> {
  goToAuthPage: () => void;
  goToAccountPage: () => void;
}

export class UserDataActor extends SectionActorBase<"feStore"> {
  private goToAuthPage: () => void;
  private goToAccountPage: () => void;
  constructor({ goToAuthPage, goToAccountPage, ...rest }: Props) {
    super(rest);
    this.goToAuthPage = goToAuthPage;
    this.goToAccountPage = goToAccountPage;
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
  private get setter(): SetterSection<"feStore"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get userDataStatus(): StateValue<"userDataStatus"> {
    return this.get.valueNext("userDataStatus");
  }
  updateUserDataStatus(userDataStatus: StateValue<"userDataStatus">): void {
    this.setter.updateValues({ userDataStatus });
  }
  get userDataFetchTryCount() {
    return this.get.valueNext("userDataFetchTryCount");
  }
  addGetUserDataTry() {
    this.setter.updateValues({
      userDataFetchTryCount: this.userDataFetchTryCount + 1,
    });
  }
  resetUserDataTryCount() {
    this.setter.updateValues({ userDataFetchTryCount: 0 });
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
      if (this.userDataFetchTryCount > 5) {
        await this.unloadUserData();
        throw new Error(getErrorMessage(ex));
      } else {
        setTimeout(() => this.addGetUserDataTry(), 3000);
      }
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
    unstable_batchedUpdates(async () => {
      this.setUserData(res);
      this.resetUserDataTryCount();
      this.goToAccountPage();
    });
  }
  private setUserData({ data, headers }: QueryRes<"getUserData">) {
    userTokenS.setTokenFromHeaders(headers);
    this.userDataSolver.loadUserData(data);
    this.setter.setSections();
  }
  async unloadUserData(): Promise<void> {
    userTokenS.removeUserAuthDataToken();
    await authS.endSession();
    unstable_batchedUpdates(async () => {
      this.mainSetter.resetToDefault();
      this.goToAuthPage();
    });
  }
}

export function useControlUserData() {
  const query = useQueryAction();
  const userDataActor = useUserDataActor();
  const { userDataStatus, userDataFetchTryCount } = userDataActor;

  React.useEffect(() => {
    userDataActor.controlUserData();
  });

  const fetchCountRef = React.useRef(null as null | number);
  React.useEffect(() => {
    if (
      userDataStatus === "loading" &&
      fetchCountRef.current !== userDataFetchTryCount
    ) {
      fetchCountRef.current = userDataFetchTryCount;
      query({ type: "loadUserData" });
    }
  }, [userDataStatus, userDataFetchTryCount, query]);
}

export function useLogout() {
  const userDataActor = useUserDataActor();
  return async function logout() {
    return userDataActor.unloadUserData();
  };
}
