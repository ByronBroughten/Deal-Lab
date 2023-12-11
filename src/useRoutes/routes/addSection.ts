import { Request, Response } from "express";
import { UserInfoTokenProp } from "../../client/src/App/modules/services/userTokenS";
import { DbUser } from "../../database/DbUser";
import { getAuthWare } from "../../middleware/authWare";
import { userJwtWare } from "../../middleware/jwtWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateSectionPackReq } from "./routesShared/validateCommonReqs";

export const addSectionWare = [getAuthWare(), userJwtWare, addSection] as const;
async function addSection(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    userJwt: { userId, labSubscription },
  } = validateSectionPackReq(req).body;

  const dbUser = await DbUser.initBy("userId", userId);
  await dbUser.addSection({
    storeName: dbStoreName,
    labSubscription,
    sectionPack,
  });

  sendSuccess(res, "addSection", {
    data: { dbId: sectionPack.dbId },
    headers: req.headers as UserInfoTokenProp,
  });
}
