import { Request, Response } from "express";
import { config } from "../../client/src/App/Constants";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/Crud/Register";
import { NextReq } from "../../client/src/App/sharedWithServer/CrudNext";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { UserDbRaw } from "../shared/UserDbNext";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginRoute } from "./loginNext";

export const crudRegisterNext = {
  routeBit: config.url.nextRegister.bit,
  operation: "post",
  async receive(req: Request, res: Response) {
    const reqObj = validateReq(req, res);
    if (!reqObj) return;
    const { payload } = reqObj.body;

    const newUserData = await userServerSideNext.makeUserData(payload);
    const foundUser = await findUserByEmailLower(newUserData.user.emailLower);
    if (foundUser)
      return res.status(400).send("An account with that email already exists.");

    const { dbUser, mongoUser } = userServerSideNext.makeDbAndMongoUser({
      newUserData,
      guestAccessSections: payload.guestAccessSections,
    });

    await mongoUser.save();
    return loginRoute.doLogin(res, { ...dbUser, _id: mongoUser._id });
  },
} as const;

function validateReq(
  req: Request,
  res: Response
): NextReq<"nextRegister", "post"> | undefined {
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
  if (!areGuestAccessSectionsNext(guestAccessSections)) {
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
}

async function findUserByEmailLower(
  emailLower: string
): Promise<UserDbRaw | undefined> {
  const foundUser = await UserModelNext.findOne(
    userServerSideNext.emailLowerFilter(emailLower),
    undefined,
    { lean: true }
  );
  if (foundUser) return foundUser;
  else return undefined;
}
