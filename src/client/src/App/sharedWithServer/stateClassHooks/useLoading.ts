import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { useInputModal } from "../../components/Modals/InputModalProvider";
import { useAction } from "./useAction";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAddDeal() {
  const { setModal } = useInputModal();
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const addActiveDeal = useAction("addActiveDeal");
  const goToActiveDeal = useGoToPage("activeDeal");

  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const isCreatingDeal = sessionStore.valueNext("isCreatingDeal");

  React.useEffect(() => {
    if (isCreatingDeal) {
      unstable_batchedUpdates(() => {
        addActiveDeal({ dealMode: newDealMenu.valueNext("dealMode") });
        setModal(null);
        goToActiveDeal();
      });
    }
  }, [isCreatingDeal, addActiveDeal, setModal]);
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
