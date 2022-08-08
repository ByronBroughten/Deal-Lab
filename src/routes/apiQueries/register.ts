import { Request, Response } from "express";
import mongoose from "mongoose";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  areGuestAccessSections,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { handleResAndMakeError } from "../../utils/resError";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";

export const registerTestId = makeMongooseObjectId();
export const nextRegisterWare = [registerServerSide] as const;

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateRegisterReq(req, res);
  const dbUser = await LoadedDbUser.createSaveGet({
    _id: makeRegisterId(),
    ...reqObj.body,
  });
  dbUser.sendLogin(res);
}

function validateRegisterReq(
  req: Request,
  res: Response
): QueryReq<"register"> {
  const { registerFormData, guestAccessSections } = req.body;
  if (!isRegisterFormData(registerFormData)) {
    throw handleResAndMakeError(
      res,
      400,
      "Register form data failed validation"
    );
  }
  if (!areGuestAccessSections(guestAccessSections)) {
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
