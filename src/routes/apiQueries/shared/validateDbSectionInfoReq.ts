import { Request, Response } from "express";
import { DbPackInfoReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import {
  DbStoreNameByType,
  dbStoreNameS,
  DbStoreType,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/dbStoreNameArrs";
import { ResHandledError } from "../../../resErrorUtils";
import { LoggedIn, validateUserJwt } from "./UserAuthedReq";

export function validateDbSectionInfoReq(
  req: Request,
  res: Response
): LoggedIn<DbPackInfoReq> {
  const { userJwt, dbId, dbStoreName } = (req as LoggedIn<DbPackInfoReq>).body;
  return {
    body: {
      dbId: validateDbId(dbId, res),
      dbStoreName: validateDbStoreName(dbStoreName),
      userJwt: validateUserJwt(userJwt),
    },
  };
}

function validateDbId(value: any, res: Response): string {
  if (Id.is(value)) return value;
  else {
    res.status(500).send("The received dbId is not valid.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}

export function validateDbStoreName<DT extends DbStoreType = "all">(
  value: any,
  type?: DT
): DbStoreNameByType<DT> {
  if (dbStoreNameS.is(value, type)) return value;
  else {
    throw new Error("The received dbStoreName is not valid.");
  }
}
