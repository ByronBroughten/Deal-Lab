import { Request, Response } from "express";
import { CreateDealReq } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { DbUser } from "../../database/DbUser";
import {
  Authed,
  getAuthWare,
  validateAuthData,
} from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateDbId } from "./routesShared/validateCommonReqs";

export const getNewDealWare = [getAuthWare(), getNewDeal] as const;

async function getNewDeal(req: Request, res: Response) {
  const { auth, ...rest } = validateCreateDealReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);

  if (rest.loadFrom === "dataBase") {
    let sectionPack = await dbUser.getSectionPack({
      dbStoreName: "dealMain",
      dbId: rest.dbId,
    });
    sendSuccess(res, "getSection", { data: { sectionPack } });
  } else {
  }
}

type Req = Authed<CreateDealReq>;
export function validateCreateDealReq(value: any): Req {
  const { auth, ...rest } = Obj.validateObjToAny(value?.body) as Req["body"];
  if (rest.loadFrom === "zillow") {
    return {
      body: {
        auth: validateAuthData(auth),
        loadFrom: "zillow",
      },
    };
  } else {
    return {
      body: {
        auth: validateAuthData(auth),
        loadFrom: "dataBase",
        dbId: validateDbId(rest.dbId),
      },
    };
  }
}
