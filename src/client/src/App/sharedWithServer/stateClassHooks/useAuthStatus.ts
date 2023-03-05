import { StateValue } from "../SectionsMeta/values/StateValue";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAuthStatus(): StateValue<"authStatus"> {
  const userInfo = useGetterSectionOnlyOne("feUser");
  return userInfo.valueNext("authStatus");
}
