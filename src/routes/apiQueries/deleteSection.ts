import { Request, Response } from "express";
import { DbStoreInfo } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { checkLoginWare } from "../../middleware/authWare";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const deleteSectionWare = [
  checkLoginWare,
  deleteSectionServerSide,
] as const;

async function deleteSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    ...spInfo
  } = validateDbSectionInfoReq(req).body;
  await findUserByIdAndUpdate({
    userId,
    queryParameters: makePullParameters(spInfo),
  });

  sendSuccess(res, "deleteSection", { data: { dbId: spInfo.dbId } });
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
