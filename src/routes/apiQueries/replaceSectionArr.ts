import { Request, Response } from "express";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { SavableSectionName } from "../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import authWare from "../../middleware/authWare";
import { SectionPackDb } from "../SectionPackDb";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
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

  sendSuccess(res, "replaceSectionArr", {
    data: {
      dbStoreName: rest.dbStoreName,
    },
  });
}

type MakeSetSectionArrParametersProps = {
  dbStoreName: SavableSectionName<"arrStore">;
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
