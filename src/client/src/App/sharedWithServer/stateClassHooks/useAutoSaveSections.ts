import React from "react";
import { useFeStore } from "../../modules/sectionActorHooks/useFeStore";

export function useAutoSaveSections() {
  const feStore = useFeStore();
  const isfirstPassAfterLoginRef = React.useRef(null as null | true | false);
  const { isLoggedIn, saveStatus } = feStore;

  React.useEffect(() => {
    if (isLoggedIn) {
      if (isfirstPassAfterLoginRef.current === null) {
        isfirstPassAfterLoginRef.current = true;
      } else if (isfirstPassAfterLoginRef.current === true) {
        isfirstPassAfterLoginRef.current = false;
      }
    }
    if (!isLoggedIn && isfirstPassAfterLoginRef.current !== null) {
      isfirstPassAfterLoginRef.current = null;
    }
  }, [isLoggedIn, isfirstPassAfterLoginRef.current]);

  const isNewlySavedRef = React.useRef(false);
  const isNewlySavingRef = React.useRef(false);
  React.useEffect(() => {
    if (
      (saveStatus === "saved" || saveStatus === "saving") &&
      isLoggedIn &&
      !isfirstPassAfterLoginRef.current &&
      !isNewlySavingRef.current &&
      !isNewlySavedRef.current
    ) {
      feStore.setSaveStatus("unsaved");
    }
  }, [isLoggedIn, saveStatus, feStore]);
  React.useEffect(() => {
    if (isNewlySavedRef.current) {
      isNewlySavedRef.current = false;
    }
    if (isNewlySavingRef.current) {
      isNewlySavingRef.current = false;
    }
  });

  React.useEffect(() => {
    if (saveStatus === "unsaved") {
      let timerFunc = setTimeout(() => {
        isNewlySavingRef.current = true;
        feStore.setSaveStatus("saving");
      }, 3000);
      return () => {
        clearTimeout(timerFunc);
      };
    }
  }, [saveStatus, feStore]);

  const saveIsInterruptedRef = React.useRef(false);
  React.useEffect(() => {
    if (saveIsInterruptedRef.current === false) {
      saveIsInterruptedRef.current = true;
    }
  });
  React.useEffect(() => {
    if (saveStatus === "saving") {
      const save = async () => {
        saveIsInterruptedRef.current = false;
        try {
          feStore.setterSections.applyVariablesToDealPages();
          await feStore.saveAllSections();
          if (!saveIsInterruptedRef.current) {
            isNewlySavedRef.current = true;
            feStore.setSaveStatus("saved");
          }
        } catch (ex) {
          feStore.setSaveStatus("unsaved");
          throw ex;
        }
      };
      save();
    }
  }, [saveStatus, feStore]);
}
