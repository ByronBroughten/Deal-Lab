import { Request, Response } from "express";
import {
  SectionPackArrReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  isSectionPack,
  SectionPack,
  ServerSectionPack,
} from "../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
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
      sectionPack: validateServerSectionPack(sectionPack),
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
}: ValidateServerSectionPackArrProps): SectionPack<SectionName<"arrStore">>[] {
  if (
    Array.isArray(value) &&
    value.every(
      (v) => isSectionPack(v, "dbStoreNext") && v.sectionName === sectionName
    )
  ) {
    return value as SectionPack<SectionName<"arrStore">>[];
  } else throw new Error("Payload is not a valid server section array.");
}

function validateServerSectionPack(value: any): ServerSectionPack {
  if (isSectionPack(value, "dbStoreNext")) return value;
  throw new Error("Payload is not a valid server sectionPack");
}
