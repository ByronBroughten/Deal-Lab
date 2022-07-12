import { Request, Response } from "express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import authWare from "../../middleware/authWare";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { LoggedIn } from "./shared/LoggedInUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [authWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
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
