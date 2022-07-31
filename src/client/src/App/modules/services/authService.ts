import { constants } from "../../Constants";

const userAuthKey = constants.tokenKey.apiUserAuth;
export const auth = {
  setToken(token: string): void {
    localStorage.setItem(constants.tokenKey.apiUserAuth, token);
  },
  setTokenFromHeaders<H extends AuthHeadersProp>(headers: H): void {
    this.setToken(headers[userAuthKey]);
  },
  getToken(): string | null {
    const token = localStorage.getItem(userAuthKey);
    return token;
  },
  removeToken(): void {
    localStorage.removeItem(userAuthKey);
  },
  get isToken(): boolean {
    const token = this.getToken();
    return !!token;
  },
};

export type AuthHeadersProp = { [constants.tokenKey.apiUserAuth]: string };
export function hasAuthHeadersProp(value: any): value is AuthHeadersProp {
  return (
    typeof value === "object" &&
    typeof value[constants.tokenKey.apiUserAuth] === "string"
  );
}
