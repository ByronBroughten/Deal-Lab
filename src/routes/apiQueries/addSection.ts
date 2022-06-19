import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ServerSectionPack } from "../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import authWare from "../../middleware/authWare";
import { ResStatusError } from "../../resErrorUtils";
import { SectionPackDb } from "../SectionPackDb";
import { DbSectionNotFoundError } from "./shared/DbSections/DbSection";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import {
  findSectionPack,
  FindSectionPackProps,
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
  await checkThatSectionPackIsNotThere({
    ...sectionPack,
    userId,
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
>(props: FindSectionPackProps<SN>): Promise<true> {
  const { sectionName, dbId } = props;
  try {
    await findSectionPack(props);
    throw new ResStatusError({
      errorMessage: `An entry at ${sectionName}.${dbId} already exists.`,
      resMessage: "The sent payload has already been saved.",
      status: 500,
    });
  } catch (err) {
    if (err instanceof DbSectionNotFoundError) {
      return true;
    } else {
      throw err;
    }
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
