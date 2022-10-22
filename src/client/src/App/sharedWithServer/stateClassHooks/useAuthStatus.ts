import { AuthStatus } from "../SectionsMeta/baseSectionsVarbs";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAuthStatus() {
  const userInfo = useGetterSectionOnlyOne("feUserInfo");
  return userInfo.valueNext("authStatus") as AuthStatus;
}
