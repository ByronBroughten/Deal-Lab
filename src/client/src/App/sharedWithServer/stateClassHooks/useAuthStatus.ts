import { AuthStatus } from "../SectionsMeta/baseSections";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useAuthStatus() {
  const authInfo = useGetterSectionOnlyOne("authInfo");
  return authInfo.value("authStatus", "string") as AuthStatus;
}