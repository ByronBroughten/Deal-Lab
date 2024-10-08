import { toastNotice } from "../../Components/App/appWide/toast";
import { constants } from "../../sharedWithServer/Constants";
import { useGetterFeStore } from "./useFeStore";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useIsAtDealLimit() {
  const { labSubscription } = useGetterFeStore();
  const session = useGetterSectionOnlyOne("sessionStore");
  if (
    labSubscription === "basicPlan" &&
    session.childCount("dealMain") >= constants.basicStorageLimit
  ) {
    return true;
  } else {
    return false;
  }
}

export const showDealLimitReachedMessage = () =>
  toastNotice(
    `To add more than ${constants.basicStorageLimit} deals, upgrade to pro.`
  );
