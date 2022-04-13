import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/Register";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginUtils } from "./nextLogin/loginUtils";

export const nextRegisterHandlers = [registerServerSide] as const;

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;
  const { payload } = reqObj.body;

  const newUserData = await userServerSideNext.makeUserData(payload);
  const foundUser = await loginUtils.tryFindOneUserByEmail(
    newUserData.user.emailLower
  );
  if (foundUser)
    return res.status(400).send("An account with that email already exists.");

  const { dbUser, mongoUser } = userServerSideNext.makeDbAndMongoUser({
    newUserData,
    guestAccessSections: payload.guestAccessSections,
  });

  try {
    await mongoUser.save();
  } catch (err) {
    return res.status(500).send("Unknown error; registration failed.");
  }

  return loginUtils.doLogin(res, { ...dbUser, _id: mongoUser._id });
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
