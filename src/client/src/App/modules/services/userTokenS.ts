import { constants } from "../../../sharedWithServer/Constants";
import { Obj } from "../../../sharedWithServer/utils/Obj";

const userDataKey = constants.tokenKey.userAuthData;
export type UserInfoTokenProp = { [userDataKey]: string };
export const userTokenS = {
  get userToken(): string | null {
    const token = localStorage.getItem(userDataKey);
    return token;
  },
  get tokenExists(): boolean {
    return !!this.userToken;
  },
  setToken(token: string): void {
    localStorage.setItem(constants.tokenKey.userAuthData, token);
  },
  setTokenFromHeaders<H extends UserInfoTokenProp>(headers: H): void {
    this.setToken(headers[userDataKey]);
  },
  removeUserAuthDataToken(): void {
    localStorage.removeItem(userDataKey);
  },
  validateHasUserTokenProp(value: any): UserInfoTokenProp {
    value = Obj.validateObjToAny(value);
    if (typeof value[constants.tokenKey.userAuthData] === "string") {
      return value;
    } else {
      throw new Error(
        `value[${constants.tokenKey.userAuthData}] did not yield a string.`
      );
    }
  },
  hasUserTokenHeaderProp(value: any): value is UserInfoTokenProp {
    return (
      typeof value === "object" &&
      typeof value[constants.tokenKey.userAuthData] === "string"
    );
  },
};
