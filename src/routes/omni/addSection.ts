import { Request, Response } from "express";
import { SectionName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPack";
import {
  SectionPackDbRaw,
  SectionPackRaw,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  NextReq,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import authWare from "../../middleware/authWare";
import { ResHandledError } from "../../middleware/error";
import { serverSend } from "../shared/crudValidators";
import {
  findSectionPack,
  FindSectionPackProps,
} from "./shared/findSectionPack";
import { findUserByIdAndUpdate } from "./shared/findUserByIdAndUpdate";
import { LoggedIn, validateLoggedInUser } from "./shared/validateLoggedInUser";

type ServerSectionPack = SectionPackRaw<"db", SectionName<"dbStore">>;
export const addSectionWare = [authWare, addSectionServerSide] as const;

async function addSectionServerSide(req: Request, res: Response) {
  const {
    payload,
    user: { _id: userId },
  } = validateAddSectionReq(req, res).body;

  const { sectionName: dbStoreName, dbId } = payload;
  await checkThatSectionPackIsNotThere({
    userId,
    spInfo: { dbStoreName, dbId },
    res,
  });
  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makePushParameters(payload),
  });

  const resObj: NextRes<"addSection"> = { data: payload.dbId };
  serverSend.success(res, resObj);
}

function validateAddSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"addSection">> {
  const { user, payload } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      payload: validateServerSectionPack(payload, res),
    },
  };
}

function validateServerSectionPack(
  value: any,
  res: Response
): ServerSectionPack {
  if (SectionPack.isRaw(value, { contextName: "db", sectionType: "dbStore" }))
    return value;
  else {
    res.status(500).send("The payload is not a valid server section pack.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
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
  sectionPack: SectionPackRaw<"db", SectionName<"dbStore">>
) {
  const { sectionName } = sectionPack;
  const dbSectionPack: SectionPackDbRaw<SectionName<"dbStore">> =
    Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
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
