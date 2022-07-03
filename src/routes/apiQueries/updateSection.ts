import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { DbSectionName } from "../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/storeArrs";
import authWare from "../../middleware/authWare";
import { findOneAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
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
  sendSuccess(res, "updateSection", { data: { dbId: sectionPack.dbId } });
}

function validateUpdateSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"updateSection">> {
  return validateSectionPackReq(req, res);
}

type MakeUpdateSectionFilterProps = {
  userId: string;
  sectionName: DbSectionName;
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
  return {
    operation: { $set: { [`${sectionName}.$`]: serverSectionPack } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      // runValidators: true,
      strict: false,
    },
  };
}
