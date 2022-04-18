import config from "config";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import mongoose from "mongoose";
import { authTokenKey } from "../../../client/src/App/sharedWithServer/Crud";
import { resHandledError } from "../../../middleware/error";
import { UserDbNext, UserDbRaw } from "../../shared/UserDbNext";
import { UserModelNext } from "../../shared/UserModelNext";
import { userServerSide } from "../userServerSide";

export const loginUtils = {
  async tryFindOneUserByEmail(emailLower: string) {
    try {
      return await UserModelNext.findOne(
        userServerSide.findByEmailFilter(emailLower),
        undefined,
        { lean: true }
      );
    } catch (err) {
      return undefined;
    }
  },
  decodeUserAuthToken(token: any): UserJwt | null {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    if (isUserJwt(decoded)) return decoded;
    else return null;
  },
  checkUserAuthToken(token: any, res: Response): UserJwt {
    const decoded = this.decodeUserAuthToken(token);
    if (decoded) return decoded;
    else
      throw resHandledError(res, 401, "Access denied. Invalid token provided.");
  },
  dummyUserAuthToken() {
    const arbitraryId = new mongoose.Types.ObjectId();
    return this.makeUserAuthToken(arbitraryId.toHexString());
  },
  makeUserAuthToken(userId: string) {
    const userJwt: UserJwt = { _id: userId };
    try {
      return jwt.sign(userJwt, config.get("jwtPrivateKey"));
    } catch (err) {
      throw new Error("JWT failed to be made.");
    }
  },
  doLogin(res: Response, user: UserDbRaw & { _id?: any }) {
    if ("_id" in user && typeof user._id !== "undefined") {
      const userDb = UserDbNext.init(user);
      const loggedInUser = userDb.makeRawFeLoginUser();
      const token = this.makeUserAuthToken(user._id);
      res.header(authTokenKey, token).status(200).send(loggedInUser);
    } else {
      throw new Error("A valid user id is required here.");
    }
  },
};

export type UserJwt = { _id: string };
function tokenHasCorrectProps(value: any) {
  return (
    "_id" in value &&
    "iat" in value &&
    typeof value._id === "string" &&
    typeof value.iat === "number"
  );
}
function isUserJwt(value: any): value is UserJwt {
  return (
    isObject(value) &&
    Object.keys(value).length === 2 &&
    tokenHasCorrectProps(value)
  );
}
