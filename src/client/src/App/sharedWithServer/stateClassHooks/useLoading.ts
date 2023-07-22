import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { useAction } from "./useAction";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useDoCompare() {
  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const status = sessionStore.valueNext("compareDealStatus");
  const doCompare = useAction("doDealCompare");

  React.useEffect(() => {
    if (status === "buildingCompare") {
      doCompare({});
    }
  }, [status, doCompare]);
}

export function useAddDeal() {
  const addActiveDeal = useAction("addActiveDeal");
  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");

  const isCreatingDeal = sessionStore.valueNext("isCreatingDeal");
  const dealMode = newDealMenu.valueNext("dealMode");

  React.useEffect(() => {
    if (isCreatingDeal) {
      addActiveDeal({ dealMode });
    }
  }, [isCreatingDeal, addActiveDeal, dealMode]);
}

export function useEditDeal() {
  const activateDeal = useAction("activateDeal");
  const goToActiveDeal = useGoToPage("activeDeal");

  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const dbId = sessionStore.valueNext("dealDbIdToEdit");
  const feStore = useGetterSectionOnlyOne("feStore");
  const getFeId = (): string => {
    if (dbId) {
      const deal = feStore.childByDbId({ childName: "dealMain", dbId });
      return deal.feId;
    } else {
      return "";
    }
  };
  const feId = getFeId();
  React.useEffect(() => {
    if (feId) {
      unstable_batchedUpdates(() => {
        activateDeal({ feId, finishEditLoading: true });
        goToActiveDeal();
      });
    }
  }, [feId, activateDeal]);
}
