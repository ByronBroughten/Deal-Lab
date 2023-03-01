import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";

import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth } = validateGetUserDataReq(req).body;
  if (!(await DbUser.existsBy("authId", auth.id))) {
    throw new Error("A user wasn't created on sign-up or sign-in.");
    // const authUser = await supertokens.getUserById(auth.id);
    // if (authUser) {
    //   const userName = Str.emailBeforeAt(authUser.email);
    //   await initUserInDb({
    //     userName,
    //     email: authUser.email,
    //     authId: auth.id,
    //     timeJoined: timeS.now(),
    //   });
    // } else {
    //   throw new Error("There is a session but no authUser");
    // }
  }
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.initMainTablesIfNeeded();
  const loaded = await dbUser.loadedDbUser();
  loaded.sendUserData(res);
}

type Req = Authed<QueryReq<"getUserData">>;
function validateGetUserDataReq(req: Request): Req {
  const { auth } = (req as Req).body;
  return makeReq({ auth: validateAuthObj(auth) });
}
