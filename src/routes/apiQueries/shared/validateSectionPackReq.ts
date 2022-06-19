import { Request, Response } from "express";
import {
  SectionPackArrReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionPack } from "../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { handleResAndMakeError } from "../../../resErrorUtils";
import { validateDbStoreName } from "./validateDbSectionInfoReq";
import { LoggedIn, validateLoggedInUser } from "./validateLoggedInUser";

export function validateSectionPackArrReq(
  req: Request,
  res: Response
): LoggedIn<SectionPackArrReq> {
  const { sectionPackArr, user, sectionName } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      sectionName: validateDbStoreName(sectionName, res, "arrStore"),
      sectionPackArr: validateServerSectionPackArr({
        value: sectionPackArr,
        sectionName,
        res,
      }),
    },
  };
}

export function validateSectionPackReq(
  req: Request,
  res: Response
): LoggedIn<SectionPackReq> {
  const { user, sectionPack } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      sectionPack: validateServerSectionPack(sectionPack, res),
    },
  };
}

type ValidateServerSectionPackArrProps = {
  value: any;
  res: Response;
  sectionName: SectionName<"arrStore">;
};
function validateServerSectionPackArr({
  value,
  res,
  sectionName,
}: ValidateServerSectionPackArrProps): SectionPackRaw<
  SectionName<"arrStore">
>[] {
  if (
    Array.isArray(value) &&
    value.every((v) => SectionPack.isServer(v) && v.sectionName === sectionName)
  ) {
    return value as SectionPackRaw<SectionName<"arrStore">>[];
  } else
    throw handleResAndMakeError(
      res,
      500,
      "Payload is not a valid server section array."
    );
}

function validateServerSectionPack(
  value: any,
  res: Response
): ServerSectionPack {
  if (SectionPack.isServer(value)) return value;
  else {
    throw handleResAndMakeError(
      res,
      500,
      "Payload is not a valid server section pack."
    );
  }
}
