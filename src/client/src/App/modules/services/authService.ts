import { constants } from "../../Constants";

export const auth = {
  setToken(token: string): void {
    localStorage.setItem(constants.tokenKey.apiUserAuth, token);
  },
  getToken(): string | null {
    const token = localStorage.getItem(constants.tokenKey.apiUserAuth);
    return token;
  },
  removeToken(): void {
    localStorage.removeItem(constants.tokenKey.apiUserAuth);
  },
  get isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  },
};
