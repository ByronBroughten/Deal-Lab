import { Request, Response } from "express";
import { userAuthWare } from "../../middleware/authWare";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [userAuthWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    ...dbInfo
  } = validateDbSectionInfoReq(req).body;

  const querier = await DbSectionsQuerier.initByUserId(userId);
  const sectionPack = await querier.getSectionPack(dbInfo);
  sendSuccess(res, "getSection", { data: { sectionPack } });
}
