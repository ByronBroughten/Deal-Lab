import { Request, Response } from "express";
import {
  Req,
  zRegisterFormData,
} from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { Obj } from "../../../client/src/App/sharedWithServer/utils/Obj";
import { makeDbUser, prepNewUserData, UserModel } from "../shared/makeDbUser";
import { loginUser } from "./shared/doLogin";

function validateReq(req: Request, res: Response): Req<"Register"> | undefined {
  const { payload } = req.body;
  if (!Obj.noGuardIs(payload)) {
    res.status(500).send("Payload is not an object.");
    return;
  }
  const { registerFormData, guestAccessSections } = payload;
  if (!zRegisterFormData.safeParse(registerFormData).success) {
    res.status(400).send("Payload failed validation");
    return;
  }
  // if (!zGuestAccessSections.safeParse(guestAccessSections)) {
  //   res.status(500).send("Invalid guest access sections.");
  //   return;
  // }
  return {
    body: {
      payload: {
        registerFormData,
        guestAccessSections,
      },
    },
  };
}

const userByEmailKey = "user.$.dbSections.user.$.dbVarbs.emailLower";
export async function register(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;

  const { payload } = reqObj.body;
  const newUserData = await prepNewUserData(payload);

  const isUser = await UserModel.findOne(
    { [userByEmailKey]: newUserData.user.emailLower },
    undefined,
    { lean: true }
  );
  if (isUser)
    return res.status(400).send("An account with that email already exists.");

  const user = makeDbUser(newUserData);
  const userDoc = new UserModel(user);
  await userDoc.save();
  return loginUser(res, { ...user, _id: userDoc._id });
}
