import {
  DbAction,
  validateDbAction,
} from "../../../client/src/sharedWithServer/apiQueriesShared/DbAction";
import { SyncChangesReq } from "../../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Arr } from "../../../client/src/sharedWithServer/utils/Arr";
import { Authed, validateAuthData } from "../../../middleware/authWare";
import { WithJWT } from "../../../middleware/jwtWare";

type Req = Authed<WithJWT<SyncChangesReq>>;
export function validateUpdateSectionsReq(req: Authed<any>): Req {
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
