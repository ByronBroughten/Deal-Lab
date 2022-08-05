import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { areGuestAccessSections } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { Authed, isAuthObject } from "./shared/ReqAugmenters";

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth, guestAccessSections } = validateGetUserDataReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);

  // Here I can create "getValue"
  // It would

  // I must check whether the person already had the guestAccessSections applied.
  // This is a pretty important thing to not fuck up.

  // I only want to do this once.
  // Solutions:
  // 1. have a value called, "guestAccessSectionsLoaded" or something. Change
  //    that value here, and check it before doing this.

  // 2. Try using a different path for registering and logging in.
  //    Still, you'd want to do a check, because you don't want guestAccessSections
  //    To accidentally load by someone visiting the wrong path

  for (const storeName of Obj.keys(guestAccessSections)) {
    const sectionPackArr = guestAccessSections[storeName] as any[];
    dbUser.setSectionPackArr({
      storeName,
      sectionPackArr,
    });
  }

  const loaded = await dbUser.loadedDbUser();
  loaded.sendLogin(res);
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
