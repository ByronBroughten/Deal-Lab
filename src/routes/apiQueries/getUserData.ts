import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { areGuestAccessSections } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { getAuthWare } from "../../middleware/authWare";
import { QueryUser } from "./shared/DbSections/QueryUser";
import { Authed, isAuthObject } from "./shared/ReqAugmenters";

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth, guestAccessSections } = validateGetUserDataReq(req).body;
  const dbUser = await QueryUser.init(auth.id, "authId");
  for (const storeName of Obj.keys(guestAccessSections)) {
    const sectionPackArr = guestAccessSections[storeName] as any[];
    dbUser.setSectionPackArr({
      storeName,
      sectionPackArr,
    });
  }
  // queryUser needs a "loadIntoMemory" function that
  // produces loadedDbUser
  // and that makes and sends the login data
}

type Req = Authed<QueryReq<"getUserData">>;
function validateGetUserDataReq(req: Request): Req {
  const { guestAccessSections, auth } = (req as Req).body;

  if (!isAuthObject(auth)) throw new Error("Invalid auth object");
  if (!areGuestAccessSections(guestAccessSections)) {
    throw new Error("Invalid guesteAccessSections");
  }
  return makeReq({ guestAccessSections, auth });
}
