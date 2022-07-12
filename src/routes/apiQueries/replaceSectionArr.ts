import { Request, Response } from "express";
import { SectionPackArrReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import authWare from "../../middleware/authWare";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackArrReq } from "./shared/validateSectionPackReq";

export const replaceSectionArrWare = [authWare, replaceSectionArrServerSide];

async function replaceSectionArrServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
    ...rest
  } = validateSectionPackArrReq(req).body;

  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makeSetSectionArrParameters(rest),
  });

  sendSuccess(res, "replaceSectionArr", {
    data: {
      dbStoreName: rest.dbStoreName,
    },
  });
}

function makeSetSectionArrParameters({
  dbStoreName,
  sectionPackArr,
}: SectionPackArrReq["body"]) {
  return {
    operation: { $set: { [`${dbStoreName}`]: sectionPackArr } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      // runValidators: true,
      strict: false,
    },
  };
}
