import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { areGuestAccessSections } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { timeS } from "../../client/src/App/sharedWithServer/utils/date";
import { Str } from "../../client/src/App/sharedWithServer/utils/Str";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { userPrepS } from "./apiQueriesShared/DbSections/LoadedDbUser/userPrepS";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth, guestAccessSections } = validateGetUserDataReq(req).body;

  if (!(await DbUser.existsBy("authId", auth.id))) {
    const authUser = await getUserById(auth.id);
    if (authUser) {
      const userName = Str.emailBeforeAt(authUser.email);
      await userPrepS.initUserInDb({
        userName,
        email: authUser.email,
        authId: auth.id,
        timeJoined: timeS.now(),
      });
    } else {
      throw new Error("There is a session but no authUser");
    }
  }
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.initUserSectionsIfNeeded(guestAccessSections);
  await dbUser.initMainTablesIfNeeded();
  const loaded = await dbUser.loadedDbUser();
  loaded.sendLogin(res);
}

type Req = Authed<QueryReq<"getUserData">>;
function validateGetUserDataReq(req: Request): Req {
  const { guestAccessSections, auth } = (req as Req).body;
  if (!areGuestAccessSections(guestAccessSections)) {
    throw new Error("Invalid guesteAccessSections");
  }
  return makeReq({
    auth: validateAuthObj(auth),
    guestAccessSections,
  });
}
