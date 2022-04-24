import { Request, Response } from "express";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  NextReq,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SectionName } from "../../client/src/App/sharedWithServer/SectionMetas/SectionName";
import authWare from "../../middleware/authWare";
import { serverSend } from "../shared/crudValidators";
import { SectionPackDb } from "../shared/UserDbNext/SectionPackDb";
import { findOneAndUpdate } from "./shared/findAndUpdate";
import { LoggedIn } from "./shared/validateLoggedInUser";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const updateSectionWare = [authWare, updateSectionSeverSide] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const {
    sectionPack,
    user: { _id: userId },
  } = validateUpdateSectionReq(req, res).body;

  await findOneAndUpdate({
    res,
    filter: makeUpdateSectionFilter({ userId, ...sectionPack }),
    queryParameters: makeSetParameters(sectionPack),
  });

  const resObj: NextRes<"updateSection"> = { data: { dbId: sectionPack.dbId } };
  serverSend.success({ res, resObj });
}

function validateUpdateSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"updateSection">> {
  return validateSectionPackReq(req, res);
}

type MakeUpdateSectionFilterProps = {
  userId: string;
  sectionName: SectionName<"dbStore">;
  dbId: string;
};
function makeUpdateSectionFilter({
  userId,
  sectionName,
  dbId,
}: MakeUpdateSectionFilterProps) {
  return { _id: userId, [`${sectionName}.dbId`]: dbId };
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
      // runValidators: true,
      strict: false,
    },
  };
}
