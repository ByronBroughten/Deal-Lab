import { NavigateFunction, useNavigate } from "react-router-dom";
import { FeRouteName, feRoutes } from "../../Constants/feRoutes";

export type GoToPageValue = FeRouteName | number;
export function useGoToPage(value: GoToPageValue): () => void {
  const navigate = useNavigate();
  return makeGoToPage(navigate, value);
}

export function useMakeGoToPage(): (value: GoToPageValue) => () => void {
  const navigate = useNavigate();
  return (value: GoToPageValue) => makeGoToPage(navigate, value);
}

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
