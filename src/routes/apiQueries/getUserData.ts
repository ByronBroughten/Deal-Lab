import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { areGuestAccessSections } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { isSectionPackByType } from "../../client/src/App/sharedWithServer/SectionsMeta/SectionNameByType";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth, guestAccessSections, activeDeal } =
    validateGetUserDataReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.checkAndLoadGuestAccessSections(guestAccessSections);
  const loaded = await dbUser.loadedDbUser();
  loaded.sendLogin(res, activeDeal);
}

type Req = Authed<QueryReq<"getUserData">>;
function validateGetUserDataReq(req: Request): Req {
  const { guestAccessSections, auth, activeDeal } = (req as Req).body;
  if (!areGuestAccessSections(guestAccessSections)) {
    throw new Error("Invalid guesteAccessSections");
  }
  if (!isSectionPackByType(activeDeal, "deal")) {
    throw new Error("Invalid activeDeal");
  }
  return makeReq({
    auth: validateAuthObj(auth),
    guestAccessSections,
    activeDeal,
  });
}
