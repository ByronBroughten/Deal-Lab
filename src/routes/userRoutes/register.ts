import { Request, Response } from "express";
import { config } from "../../client/src/App/Constants";
import { Req } from "../../client/src/App/sharedWithServer/Crud";
import {
  areGuestAccessSections,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/Crud/Register";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { serverSideUser, UserModel } from "../shared/userServerSide";
import { serverSideLogin } from "./shared/doLogin";

export const crudRegister = {
  route: config.url.register.route,
  operation: "post",
  validateReq(req: Request, res: Response): Req<"Register"> | undefined {
    const { payload } = req.body;
    if (!Obj.noGuardIs(payload)) {
      res.status(500).send("Payload is not an object.");
      return;
    }
    const { registerFormData, guestAccessSections } = payload;
    if (!isRegisterFormData(registerFormData)) {
      res.status(400).send("Payload failed validation");
      return;
    }
    if (!areGuestAccessSections(guestAccessSections)) {
      res.status(500).send("Invalid guest access sections.");
      return;
    }
    return {
      body: {
        payload: {
          registerFormData,
          guestAccessSections,
        },
      },
    };
  },
  async fn(req: Request, res: Response) {
    const reqObj = this.validateReq(req, res);
    if (!reqObj) return;

    const newUserData = await serverSideUser.prepData(reqObj.body.payload);
    const isUser = await UserModel.findOne(
      { [serverSideUser.findByEmailKey]: newUserData.user.emailLower },
      undefined,
      { lean: true }
    );
    if (isUser)
      return res.status(400).send("An account with that email already exists.");

    const user = serverSideUser.finalizeData(newUserData);
    const userDoc = new UserModel(user);
    await userDoc.save();
    return serverSideLogin.do(res, { ...user, _id: userDoc._id });
  },
} as const;
