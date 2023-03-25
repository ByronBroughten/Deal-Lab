import React from "react";
import { useFeStore } from "../../modules/sectionActorHooks/useFeStore";

export function useAutoSaveSections() {
  const feStore = useFeStore();
  const { isLoggedIn } = feStore;
  React.useEffect(() => {
    if (isLoggedIn) {
      let timerFunc = setTimeout(() => {
        feStore.saveAllSections();
      }, 5000);
      return () => clearTimeout(timerFunc);
    }
  }, [feStore, isLoggedIn]);
}
