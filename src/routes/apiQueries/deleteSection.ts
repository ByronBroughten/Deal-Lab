import { Request, Response } from "express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { DbStoreInfo } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { userAuthWare } from "../../middleware/authWare";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { LoggedIn } from "./shared/UserAuthedReq";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const deleteSectionWare = [
  userAuthWare,
  deleteSectionServerSide,
] as const;

async function deleteSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
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
): LoggedIn<QueryReq<"deleteSection">> {
  return validateDbSectionInfoReq(req, res);
}

function makePullParameters({ dbStoreName, dbId }: DbStoreInfo) {
  return {
    operation: { $pull: { [dbStoreName]: { dbId } } },
    options: {
      // new: true,
      lean: true,
      useFindAndModify: false,
    },
  };
}
