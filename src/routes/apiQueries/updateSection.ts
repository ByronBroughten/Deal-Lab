import { Request, Response } from "express";
import { DbPack } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import { SectionQueryName } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { checkLoginWare } from "../../middleware/authWare";
import { findOneAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const updateSectionWare = [
  checkLoginWare,
  updateSectionSeverSide,
] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    userJwt: { userId },
  } = validateSectionPackReq(req).body;

  await findOneAndUpdate({
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
  dbStoreName: SectionQueryName;
  dbId: string;
};
function makeUpdateSectionFilter({
  userId,
  dbStoreName,
  dbId,
}: MakeUpdateSectionFilterProps) {
  return { _id: userId, [`${dbStoreName}.dbId`]: dbId };
}
function makeSetParameters(dbPack: DbPack<any>) {
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
// filters:
// "dbStoreName.rawSection."
// "dbStoreName.rawSections.sectionName: "
// "dbStoreName.rawSections.sectionName.dbVarbs.subId"
