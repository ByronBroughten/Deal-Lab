import React from "react";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSections } from "../../sharedWithServer/stateClassHooks/useGetterSections";
import { useQueryAction } from "../../sharedWithServer/stateClassHooks/useQueryAction";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { authS } from "../customHooks/authS";

interface Props {
  getterSections: GetterSections;
}

export class UserDataActor {
  private getterSections: GetterSections;
  constructor({ getterSections }: Props) {
    this.getterSections = getterSections;
  }
  get feStore() {
    return this.getterSections.oneAndOnly("feStore");
  }
  get userDataStatus(): StateValue<"userDataStatus"> {
    return this.feStore.valueNext("userDataStatus");
  }
  get userDataFetchTryCount() {
    return this.feStore.valueNext("userDataFetchTryCount");
  }
  async shouldTriggerLoad(): Promise<boolean> {
    return this.userDataStatus === "notLoaded" && (await authS.sessionExists);
  }
  async shouldTriggerUnload(): Promise<boolean> {
    return this.userDataStatus === "loaded" && !(await authS.sessionExists);
  }
}

export function useUserDataGetter(): UserDataActor {
  const getterSections = useGetterSections();
  return new UserDataActor({ getterSections });
}

export function useControlUserData() {
  const updateValues = useAction("updateValues");
  const queryAction = useQueryAction();
  const getterSections = useGetterSections();
  const feStore = useGetterFeStore();

  const updateUserDataStatus = (
    userDataStatus: StateValue<"userDataStatus">
  ): void =>
    updateValues({
      ...getterSections.onlyFeInfo("feStore"),
      values: { userDataStatus },
    });

  const userDataGetter = useUserDataGetter();

  React.useEffect(() => {
    const controlUserData = async () => {
      if (await userDataGetter.shouldTriggerLoad()) {
        updateUserDataStatus("loading");
      }
      if (await userDataGetter.shouldTriggerUnload()) {
        queryAction({ type: "logout" });
      }
    };
    controlUserData();
  });

  const userDataStatus = feStore.get.valueNext("userDataStatus");
  const userDataFetchTryCount = feStore.get.valueNext("userDataFetchTryCount");
  const fetchCountRef = React.useRef(null as null | number);
  React.useEffect(() => {
    if (userDataFetchTryCount > 5) {
      queryAction({ type: "logout" });
    } else if (
      userDataStatus === "loading" &&
      fetchCountRef.current !== userDataFetchTryCount
    ) {
      fetchCountRef.current = userDataFetchTryCount;
      queryAction({ type: "loadUserData" });
    }
  }, [userDataStatus, userDataFetchTryCount, queryAction]);
}
