import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { UserInfoTokenProp } from "../../client/src/App/modules/services/userTokenS";
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

  const dbUser = await DbUserService.initBy("userId", userId);
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
