import { Request, Response } from "express";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeGeneralReqs";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { resHandledError } from "../../middleware/error";
import { loginUtils } from "./nextLogin/loginUtils";
import { userServerSide } from "./userServerSide";

export const nextRegisterWare = [registerServerSide] as const;
export const testRegisterId = makeMongooseObjectId();

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;
  const { registerFormData, guestAccessSections } = reqObj.body;

  const newUser = await userServerSide.makeNewUser(registerFormData);
  await checkThatUserDoesntExist(newUser.email, res);

  const _id =
    process.env.NODE_ENV === "test" ? testRegisterId : makeMongooseObjectId();
  const { dbUser, mongoUser } = userServerSide.makeDbAndMongoUser({
    newUser,
    guestAccessSections,
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
  const { registerFormData, guestAccessSections } = req.body;
  if (!isRegisterFormData(registerFormData)) {
    res.status(400).send("Register form data failed validation");
    return;
  }
  if (!areGuestAccessSectionsNext(guestAccessSections)) {
    res.status(500).send("Invalid guest access sections.");
    return;
  }

  return makeReq({
    registerFormData,
    guestAccessSections,
  });
}
