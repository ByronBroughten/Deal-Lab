import { authTokenKey } from "../../sharedWithServer/User/crudTypes";

// this stuff must be separate from Analyzer because
// Analyzer can be on the serverSide while this can't
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
