import { Request, Response } from "express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { userAuthWare } from "../../middleware/authWare";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { sendSuccess } from "./shared/sendSuccess";
import { LoggedIn } from "./shared/UserAuthedReq";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [userAuthWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    ...dbInfo
  } = validateGetSectionReq(req, res).body;

  const querier = await DbSectionsQuerier.initByUserId(userId);
  const sectionPack = await querier.getSectionPack(dbInfo);
  sendSuccess(res, "getSection", { data: { sectionPack } });
}

function validateGetSectionReq(
  req: Request,
  res: Response
): LoggedIn<QueryReq<"getSection">> {
  return validateDbSectionInfoReq(req, res);
}
