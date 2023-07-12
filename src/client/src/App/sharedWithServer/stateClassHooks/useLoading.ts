import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { useDealModeContextInputModal } from "../../components/Modals/InputModalProvider";
import { useAction, useActionNoSave } from "./useAction";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAddDeal() {
  const updateValue = useActionNoSave("updateValue");
  const { setModal } = useDealModeContextInputModal();
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const addActiveDeal = useAction("addActiveDeal");
  const goToActiveDeal = useGoToPage("activeDeal");

  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const isCreatingDeal = sessionStore.valueNext("isCreatingDeal");

  const initNewDeal = () =>
    unstable_batchedUpdates(() => {
      addActiveDeal({ dealMode: newDealMenu.valueNext("dealMode") });
      goToActiveDeal();
      setModal(null);
      updateValue({
        ...sessionStore.varbInfo("isCreatingDeal"),
        value: false,
      });
    });

  React.useEffect(() => {
    if (isCreatingDeal) {
      initNewDeal();
    }
  }, [isCreatingDeal]);
}

export function useEditDeal() {
  const sessionStore = useGetterSectionOnlyOne("sessionStore");
  const dbId = sessionStore.valueNext("dealDbIdToEdit");

  const feStore = useGetterSectionOnlyOne("feStore");

  const activateDeal = useAction("activateDeal");
  const goToActiveDeal = useGoToPage("activeDeal");

  const updateValueNoSave = useActionNoSave("updateValue");
  const endLoading = () =>
    updateValueNoSave({
      ...sessionStore.varbInfo("dealDbIdToEdit"),
      value: "",
    });

  const editDeal = ({ feId }: { feId: string }) => {
    unstable_batchedUpdates(() => {
      activateDeal({ feId });
      goToActiveDeal();
      endLoading();
    });
  };

  React.useEffect(() => {
    if (dbId) {
      const deal = feStore.childByDbId({ childName: "dealMain", dbId });
      editDeal({ feId: deal.feId });
    }
  }, [dbId]);
}
