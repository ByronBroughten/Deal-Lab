import { CreateDealReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import { Obj } from "../../../client/src/App/sharedWithServer/utils/Obj";
import { Authed, validateAuthObj } from "./ReqAugmenters";
import { validateDbId } from "./validateDbSectionInfoReq";

type ToVal = Authed<CreateDealReq>;

export function validateCreateDealReq(value: any): ToVal {
  const { auth, ...rest } = Obj.validateObjToAny(value?.body) as ToVal["body"];
  if (rest.loadFrom === "zillow") {
    return {
      body: {
        auth: validateAuthObj(auth),
        loadFrom: "zillow",
      },
    };
  } else {
    return {
      body: {
        auth: validateAuthObj(auth),
        loadFrom: "dataBase",
        dbId: validateDbId(rest.dbId),
      },
    };
  }
}
