import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import authWare from "../../middleware/authWare";
import { ResHandledError } from "../../resErrorUtils";
import { SectionPackDb } from "../SectionPackDb";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import {
  findSectionPack,
  FindSectionPackProps
} from "./shared/findSectionPack";
import { sendSuccess } from "./shared/sendSuccess";
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
  sendSuccess(res, "addSection", { data: { dbId: sectionPack.dbId } });
}

function validateAddSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"addSection">> {
  return validateSectionPackReq(req, res);
}

async function checkThatSectionPackIsNotThere<
  SN extends SectionName<"dbStoreNext">
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

function makePushParameters(serverSectionPack: ServerSectionPack) {
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
