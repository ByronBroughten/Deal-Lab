import { useNavigate } from "react-router-dom";
import { FeRouteName, feRoutes } from "../../../Constants/feRoutes";

export function useGoToPage(feRouteName: FeRouteName) {
  const navigate = useNavigate();
  return () => navigate(feRoutes[feRouteName]);
}

export function useMakeGoToPage() {
  const navigate = useNavigate();
  return (feRouteName: FeRouteName) => () => navigate(feRoutes[feRouteName]);
}
