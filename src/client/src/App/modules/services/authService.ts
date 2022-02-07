import { authTokenKey } from "../../sharedWithServer/User/crudTypes";

export const auth = {
  setToken(token: string): void {
    localStorage.setItem(authTokenKey, token);
  },
  getToken(): string | null {
    const token = localStorage.getItem(authTokenKey);
    return token;
  },
  removeToken(): void {
    localStorage.removeItem(authTokenKey);
  },
  get isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  },
};
