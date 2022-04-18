import { Request, Response } from "express";
import { DbStoreName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { makeRes } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { NextRes } from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import authWare from "../../middleware/authWare";
import { serverSend } from "../shared/crudValidators";
import { SectionPackDb } from "../shared/UserDbNext/SectionPackDb";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { validateSectionPackArrReq } from "./shared/validateSectionPackReq";

export const replaceSectionArrWare = [authWare, replaceSectionArrServerSide];

async function replaceSectionArrServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
    ...rest
  } = validateSectionPackArrReq(req, res).body;

  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makeSetSectionArrParameters(rest),
  });

  const resObj: NextRes<"replaceSectionArr"> = makeRes({
    dbStoreName: rest.dbStoreName,
  });
  serverSend.success({ res, resObj });
}

type MakeSetSectionArrParametersProps = {
  dbStoreName: DbStoreName;
  sectionPackArr: ServerSectionPack[];
};
function makeSetSectionArrParameters({
  dbStoreName,
  sectionPackArr,
}: MakeSetSectionArrParametersProps) {
  const dbPackArr = sectionPackArr.map((serverPack) =>
    SectionPackDb.serverToDbRaw(serverPack)
  );
  return {
    operation: { $set: { [`${dbStoreName}`]: dbPackArr } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      // runValidators: true,
      strict: false,
    },
  };
}
