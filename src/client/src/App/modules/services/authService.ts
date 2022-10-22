import Session from "supertokens-auth-react/recipe/session";
import { isEmailVerified } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";

const userDataKey = constants.tokenKey.userAuthData;
export const auth = {
  setToken(token: string): void {
    localStorage.setItem(constants.tokenKey.userAuthData, token);
  },
  setTokenFromHeaders<H extends UserInfoTokenProp>(headers: H): void {
    this.setToken(headers[userDataKey]);
  },
  getToken(): string | null {
    const token = localStorage.getItem(userDataKey);
    return token;
  },
  removeUserAuthDataToken(): void {
    localStorage.removeItem(userDataKey);
  },
  get isToken(): boolean {
    const token = this.getToken();
    return !!token;
  },
  async sessionExists(): Promise<boolean> {
    if (await Session.doesSessionExist()) {
      const { isVerified } = await isEmailVerified();
      return isVerified;
    } else return false;
  },
  getAuthId() {
    return Session.getUserId();
  },
};

export type UserInfoTokenProp = { [constants.tokenKey.userAuthData]: string };
export function hasAuthHeadersProp(value: any): value is UserInfoTokenProp {
  return (
    typeof value === "object" &&
    typeof value[constants.tokenKey.userAuthData] === "string"
  );
}
