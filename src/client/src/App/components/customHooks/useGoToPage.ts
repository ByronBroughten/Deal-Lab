import { unstable_batchedUpdates } from "react-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { FeRouteName, feRoutes } from "../../Constants/feRoutes";
import { useCloseAllModals } from "../Modals";

export type GoToPageValue = FeRouteName | number;
export function useGoToPage(value: GoToPageValue): () => void {
  const navAndClose = useNavigateAndClose();
  return makeGoToPage(navAndClose, value);
}

export function useMakeGoToPage(): (value: GoToPageValue) => () => void {
  const navAndClose = useNavigateAndClose();
  return (value: GoToPageValue) => makeGoToPage(navAndClose, value);
}

const useNavigateAndClose = (): NavigateFunction => {
  const closeAllModals = useCloseAllModals();
  const navigate = useNavigate();
  return (props) =>
    unstable_batchedUpdates(() => {
      closeAllModals();
      navigate(props as any);
    });
};

function makeGoToPage(
  navigate: NavigateFunction,
  value: GoToPageValue
): () => void {
  if (typeof value === "number") {
    return () => navigate(value);
  } else {
    return () => navigate(feRoutes[value]);
  }
}
