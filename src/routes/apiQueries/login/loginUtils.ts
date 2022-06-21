import { Response } from "express";
import { constants } from "../../../client/src/App/Constants";
import { ServerUser, UserDbRaw } from "../../ServerUser";
import { UserModel } from "../../UserModel";
import { DbUser } from "../shared/DbSections/DbUser";
import { userServerSide } from "../userServerSide";

export const loginUtils = {
  async tryFindOneUserByEmail(emailLower: string) {
    try {
      return await UserModel.findOne(
        userServerSide.findByEmailFilter(emailLower),
        undefined,
        { lean: true }
      );
    } catch (err) {
      return undefined;
    }
  },
  doLogin(res: Response, user: UserDbRaw & { _id?: any }) {
    if ("_id" in user && typeof user._id !== "undefined") {
      const userDb = ServerUser.init(user);
      const loggedInUser = userDb.makeRawFeLoginUser();
      const token = DbUser.makeUserAuthToken(user._id);
      res
        .header(constants.tokenKey.apiUserAuth, token)
        .status(200)
        .send(loggedInUser);
    } else {
      throw new Error("A valid user id is required here.");
    }
  },
};
