import { Request, Response } from "express";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { resHandledError } from "../../middleware/error";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginUtils } from "./nextLogin/loginUtils";

export const nextRegisterWare = [registerServerSide] as const;
export const testRegisterId = makeMongooseObjectId();

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;
  const { payload } = reqObj.body;

  const newUserData = await userServerSideNext.makeUserData(payload);
  await checkThatUserDoesntExist(newUserData.user.emailLower, res);

  const _id =
    process.env.NODE_ENV === "test" ? testRegisterId : makeMongooseObjectId();
  const { dbUser, mongoUser } = userServerSideNext.makeDbAndMongoUser({
    newUserData,
    guestAccessSections: payload.guestAccessSections,
    _id,
  });

  await mongoUser.save();
  return loginUtils.doLogin(res, { ...dbUser, _id });
}

async function checkThatUserDoesntExist(lowercaseEmail: string, res: Response) {
  const foundUser = await loginUtils.tryFindOneUserByEmail(lowercaseEmail);
  if (foundUser)
    throw resHandledError(
      res,
      400,
      "An account with that email already exists."
    );
}

function validateReq(
  req: Request,
  res: Response
): NextReq<"nextRegister"> | undefined {
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
