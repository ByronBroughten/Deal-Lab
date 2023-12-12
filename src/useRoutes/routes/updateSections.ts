import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import {
  DbAction,
  validateDbAction,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/DbAction";
import { SyncChangesReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Arr } from "../../client/src/App/sharedWithServer/utils/Arr";
import {
  Authed,
  getAuthWare,
  validateAuthData,
} from "../../middleware/authWare";
import { WithJWT, userJwtWare } from "../../middleware/jwtWare";
import { sendSuccess } from "./routesShared/sendSuccess";

export const updateSectionsWare = [
  getAuthWare(),
  userJwtWare,
  updateSections,
] as const;

export async function updateSections(req: Request, res: Response) {
  const { changes, auth, userJwt } = validateSyncChangesReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  for (const action of changes) {
    switch (action.changeName) {
      case "add": {
        await dbUser.addSection({
          storeName: action.storeName,
          labSubscription: userJwt.labSubscription,
          sectionPack: action.sectionPack,
        });
        break;
      }
      case "update": {
        await dbUser.updateSectionPack({
          dbStoreName: action.storeName,
          sectionPack: action.sectionPack,
        });
        break;
      }
      case "remove": {
        await dbUser.deleteSectionPack({
          dbStoreName: action.storeName,
          dbId: action.dbId,
        });
      }
    }
  }

  sendSuccess(res, "updateSections", { data: { success: true } });
}

type Req = Authed<WithJWT<SyncChangesReq>>;
export function validateSyncChangesReq(req: Authed<any>): Req {
  const { changes, auth, userJwt } = (req as Req).body;
  return {
    body: {
      auth: validateAuthData(auth),
      changes: validateActions(changes),
      userJwt, // this should already be validated by userJwtWare
    },
  };
}
function validateActions(value: any): DbAction[] {
  const arr = Arr.validateIsArray(value);
  return arr.map((item) => validateDbAction(item));
}
