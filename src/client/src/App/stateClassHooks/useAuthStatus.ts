import { StateValue } from "../../sharedWithServer/stateSchemas/StateValue";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAuthStatus(): StateValue<"authStatus"> {
  const userInfo = useGetterSectionOnlyOne("feStore");
  return userInfo.valueNext("authStatus");
}
