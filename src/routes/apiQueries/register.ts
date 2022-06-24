import { Request, Response } from "express";
import mongoose from "mongoose";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { handleResAndMakeError } from "../../resErrorUtils";
import { DbUser } from "./shared/DbSections/DbUser";
import { userPrepS } from "./shared/DbSections/DbUser/userPrepS";
import { userServerSide } from "./userServerSide";

export const registerTestId = makeMongooseObjectId();
export const nextRegisterWare = [registerServerSide] as const;

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateRegisterReq(req, res);
  const { registerFormData } = reqObj.body;
  const { email } = userPrepS.processEmail(registerFormData.email);
  await userServerSide.entireMakeUserProcess({
    _id: makeRegisterId(),
    ...reqObj.body,
  });

  const dbUser = await DbUser.queryByEmail(email);
  dbUser.sendLogin(res);
}

function validateRegisterReq(req: Request, res: Response): NextReq<"register"> {
  const { registerFormData, guestAccessSections } = req.body;
  if (!isRegisterFormData(registerFormData)) {
    throw handleResAndMakeError(
      res,
      400,
      "Register form data failed validation"
    );
  }
  if (!areGuestAccessSectionsNext(guestAccessSections)) {
    throw handleResAndMakeError(res, 500, "Invalid guest access sections.");
  }
  return makeReq({
    registerFormData,
    guestAccessSections,
  });
}

function makeRegisterId(): mongoose.Types.ObjectId {
  if (process.env.NODE_ENV === "test") return registerTestId;
  else return makeMongooseObjectId();
}
