import { AuthStatus } from "../SectionsMeta/baseSectionsVarbsValues";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAuthStatus() {
  const userInfo = useGetterSectionOnlyOne("feUser");
  return userInfo.valueNext("authStatus") as AuthStatus;
}
