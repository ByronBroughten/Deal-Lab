import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { DbSectionPackInfo } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import authWare from "../../middleware/authWare";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";
import { LoggedIn } from "./shared/validateLoggedInUser";

export const deleteSectionWare = [authWare, deleteSectionServerSide] as const;

async function deleteSectionServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
    ...spInfo
  } = validateDeleteSectionReq(req, res).body;
  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makePullParameters(spInfo),
  });

  sendSuccess(res, "deleteSection", { data: { dbId: spInfo.dbId } });
}

function validateDeleteSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"deleteSection">> {
  return validateDbSectionInfoReq(req, res);
}

function makePullParameters({ dbStoreName, dbId }: DbSectionPackInfo) {
  return {
    operation: { $pull: { [dbStoreName]: { dbId } } },
    options: {
      // new: true,
      lean: true,
      useFindAndModify: false,
    },
  };
}
