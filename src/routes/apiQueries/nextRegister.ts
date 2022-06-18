import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { resHandledError } from "../../middleware/error";
import { loginUtils } from "./nextLogin/loginUtils";
import { MakeDbUserProps, userServerSide } from "./userServerSide";

export const nextRegisterWare = [registerServerSide] as const;
export const testRegisterId = makeMongooseObjectId();

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateRegisterReq(req, res);
  const { registerFormData, guestAccessSections } = reqObj.body;

  const { user, serverOnlyUser } = await userServerSide.makeUserSections(
    registerFormData
  );
  await checkThatUserDoesntExist(user.email, res);
  const serverUser = await addUser({
    user,
    serverOnlyUser,
    guestAccessSections,
  });
  return loginUtils.doLogin(res, serverUser);
}

function validateRegisterReq(
  req: Request,
  res: Response
): NextReq<"nextRegister"> {
  const { registerFormData, guestAccessSections } = req.body;
  if (!isRegisterFormData(registerFormData)) {
    throw resHandledError(res, 400, "Register form data failed validation");
  }
  if (!areGuestAccessSectionsNext(guestAccessSections)) {
    throw resHandledError(res, 500, "Invalid guest access sections.");
  }

  return makeReq({
    registerFormData,
    guestAccessSections,
  });
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

async function addUser(makeDbUserProps: MakeDbUserProps) {
  const _id =
    process.env.NODE_ENV === "test" ? testRegisterId : makeMongooseObjectId();
  const { dbUser, mongoUser } = userServerSide.makeDbAndMongoUser({
    ...makeDbUserProps,
    _id,
  });

  await mongoUser.save();
  return { ...dbUser, _id };
}
