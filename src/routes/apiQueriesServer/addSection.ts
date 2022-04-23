import { Request, Response } from "express";
import { SectionName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPackRaw } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  NextReq,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import authWare from "../../middleware/authWare";
import { ResHandledError } from "../../middleware/error";
import { serverSend } from "../shared/crudValidators";
import { SectionPackDb } from "../shared/UserDbNext/SectionPackDb";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import {
  findSectionPack,
  FindSectionPackProps,
} from "./shared/findSectionPack";
import { LoggedIn } from "./shared/validateLoggedInUser";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const addSectionWare = [authWare, addSectionServerSide] as const;
async function addSectionServerSide(req: Request, res: Response) {
  const {
    sectionPack,
    user: { _id: userId },
  } = validateAddSectionReq(req, res).body;

  const { sectionName: dbStoreName, dbId } = sectionPack;
  await checkThatSectionPackIsNotThere({
    userId,
    spInfo: { dbStoreName, dbId },
    res,
  });
  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makePushParameters(sectionPack),
  });

  const resObj: NextRes<"addSection"> = { data: { dbId: sectionPack.dbId } };
  serverSend.success({ res, resObj });
}

function validateAddSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"addSection">> {
  return validateSectionPackReq(req, res);
}

async function checkThatSectionPackIsNotThere<
  SN extends SectionName<"dbStore">
>({ userId, spInfo, res }: FindSectionPackProps<SN>) {
  const sectionPack = await findSectionPack({ userId, spInfo, res });
  if (sectionPack) {
    const { dbStoreName, dbId } = spInfo;
    res
      .status(500)
      .send(
        `An entry in ${dbStoreName} already has the payload's dbId, ${dbId}`
      );
    throw new ResHandledError("Handled by checkThatSectionPackIsNotThere");
  }
}

function makePushParameters(
  serverSectionPack: SectionPackRaw<"db", SectionName<"dbStore">>
) {
  const { sectionName } = serverSectionPack;
  const dbSectionPack = SectionPackDb.serverToDbRaw(serverSectionPack);
  return {
    operation: { $push: { [sectionName]: dbSectionPack } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      runValidators: true,
      strict: false,
      upsert: true,
    },
  };
}
