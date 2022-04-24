import { Request, Response } from "express";
import {
  NextReq,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { DbSectionPackInfo } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeGeneralReqs";
import authWare from "../../middleware/authWare";
import { serverSend } from "../shared/crudValidators";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
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
  const resObj: NextRes<"deleteSection"> = { data: { dbId: spInfo.dbId } };
  serverSend.success({ res, resObj });
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
