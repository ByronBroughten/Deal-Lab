import { Request, Response } from "express";
import { DbPack } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { DbStoreName } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import authWare from "../../middleware/authWare";
import { findOneAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const updateSectionWare = [authWare, updateSectionSeverSide] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    user: { _id: userId },
  } = validateSectionPackReq(req).body;

  await findOneAndUpdate({
    res,
    filter: makeUpdateSectionFilter({
      dbStoreName,
      dbId: sectionPack.dbId,
      userId,
    }),
    queryParameters: makeSetParameters({
      dbStoreName,
      sectionPack,
    }),
  });
  sendSuccess(res, "updateSection", { data: { dbId: sectionPack.dbId } });
}

type MakeUpdateSectionFilterProps = {
  userId: string;
  dbStoreName: DbStoreName;
  dbId: string;
};
function makeUpdateSectionFilter({
  userId,
  dbStoreName,
  dbId,
}: MakeUpdateSectionFilterProps) {
  return { _id: userId, [`${dbStoreName}.dbId`]: dbId };
}

function makeSetParameters(dbPack: DbPack) {
  const { dbStoreName, sectionPack } = dbPack;
  return {
    operation: { $set: { [`${dbStoreName}.$`]: sectionPack } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      // runValidators: true,
      strict: false,
    },
  };
}
