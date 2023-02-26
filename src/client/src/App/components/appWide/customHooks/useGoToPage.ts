import { useNavigate } from "react-router-dom";
import { FeRouteName, feRoutes } from "../../../Constants";

export function useGoToPage(feRouteName: FeRouteName) {
  const navigate = useNavigate();
  return () => navigate(feRoutes[feRouteName]);
}
