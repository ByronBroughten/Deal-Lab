import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  areGuestAccessSectionsNext,
  isRegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { handleResAndMakeError, ResStatusError } from "../../resErrorUtils";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { DbUser } from "./shared/DbSections/DbUser";
import { MakeDbUserProps, userServerSide } from "./userServerSide";

export const nextRegisterWare = [registerServerSide] as const;
export const testRegisterId = makeMongooseObjectId();

async function registerServerSide(req: Request, res: Response) {
  const reqObj = validateRegisterReq(req, res);
  const { registerFormData, guestAccessSections } = reqObj.body;

  const { user, serverOnlyUser } = await userServerSide.makeUserSections(
    registerFormData
  );
  await checkEmailIsUnique(user.email);
  await addUser({
    user,
    serverOnlyUser,
    guestAccessSections,
  });
  const dbUser = await DbUser.queryByEmail(user.email);
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

async function checkEmailIsUnique(lowercaseEmail: string) {
  if (await DbSectionsQuerier.existsByEmail(lowercaseEmail)) {
    throw new ResStatusError({
      errorMessage: `An account with the email ${lowercaseEmail} already exists.`,
      resMessage: "An account with that email already exists",
      status: 400,
    });
  }
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
