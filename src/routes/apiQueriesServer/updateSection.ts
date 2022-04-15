import { Request, Response } from "express";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  NextReq,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import authWare from "../../middleware/authWare";
import { serverSend } from "../shared/crudValidators";
import { SectionPackDb } from "../shared/UserDbNext/SectionPackDb";
import { findUserByIdAndUpdate } from "./shared/findUserByIdAndUpdate";
import { LoggedIn } from "./shared/validateLoggedInUser";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const updateSectionWare = [authWare, updateSectionSeverSide] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const {
    payload,
    user: { _id: userId },
  } = validateUpdateSectionReq(req, res).body;

  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makeSetParameters(payload),
  });

  const resObj: NextRes<"updateSection"> = { data: { dbId: payload.dbId } };
  serverSend.success({ res, resObj });
}

function validateUpdateSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"updateSection">> {
  return validateSectionPackReq(req, res);
}

function makeSetParameters(serverSectionPack: ServerSectionPack) {
  const { sectionName } = serverSectionPack;
  const dbSectionPack = SectionPackDb.serverToDbRaw(serverSectionPack);
  return {
    operation: { $set: { [`${sectionName}.$`]: dbSectionPack } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      runValidators: true,
      strict: false,
    },
  };
}
