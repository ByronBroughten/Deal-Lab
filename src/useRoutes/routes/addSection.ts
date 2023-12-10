import { Request, Response } from "express";
import { UserInfoTokenProp } from "../../client/src/App/modules/services/userTokenS";
import { getAuthWare } from "../../middleware/authWare";
import { checkUserInfoWare } from "../../middleware/checkUserInfoWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateSectionPackReq } from "./apiQueriesShared/validateSectionPackReq";

export const addSectionWare = [
  getAuthWare(),
  checkUserInfoWare,
  addSection,
] as const;
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
