import { Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import mongoose from "mongoose";
import { authTokenKey } from "../../../client/src/App/sharedWithServer/User/crudTypes";

import { rowIndexToTableName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSectionTypes";
import {
  DbUser,
  LoginUser,
} from "../../../client/src/App/sharedWithServer/User/DbUser";
import { relSections } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections";
import Arr from "../../../client/src/App/sharedWithServer/utils/Arr";
import { SectionNam } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { DbEnt } from "../../../client/src/App/sharedWithServer/Analyzer/DbEntry";

export function clientify(dbUser: DbUser): LoginUser {
  const loginUser: Partial<LoginUser> = {};
  for (const sectionName of SectionNam.arr.initOnLogin) {
    if (SectionNam.is(sectionName, "table")) {
      const tableEntry = dbUser[sectionName][0];
      const tableSection = DbEnt.topSection(tableEntry, sectionName);
      const rowIds = tableSection.dbVarbs.rowIds as string[];

      const { rowSourceName } = relSections[sectionName];
      const sourceIds = dbUser[rowSourceName].map(({ dbId }) => dbId);

      const nextRowIds = Arr.extract(rowIds, sourceIds);
      for (const id of sourceIds) {
        if (!nextRowIds.includes(id)) nextRowIds.push(id);
      }

      tableSection.dbVarbs.rowIds = nextRowIds;
      loginUser[sectionName] = [tableEntry];
    }
    if (SectionNam.is(sectionName, "rowIndex")) {
      const tableName = rowIndexToTableName[sectionName];
      loginUser[sectionName] = DbEnt.newTableRows(dbUser, tableName);
    } else loginUser[sectionName] = dbUser[sectionName];
  }
  return loginUser as LoginUser;
}

export type UserJwt = { _id: string };
function tokenHasCorrectProps(value: any) {
  return (
    "_id" in value &&
    "iat" in value &&
    typeof value._id === "string" &&
    typeof value.iat === "number"
  );
}

function isUserToken(value: any): value is UserJwt {
  return (
    isObject(value) &&
    Object.keys(value).length === 2 &&
    tokenHasCorrectProps(value)
  );
}
export function decodeAndCheckUserToken(token: any): null | UserJwt {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  if (isUserToken(decoded)) return decoded;
  else return null;
}

export function makeDummyUserToken() {
  const objectId = new mongoose.Types.ObjectId();
  const _id = objectId.toHexString();
  return generateAuthToken(_id);
}
export function generateAuthToken(_id: string) {
  const userJwt: UserJwt = { _id };
  return jwt.sign(userJwt, config.get("jwtPrivateKey"));
}
export function loginUser(res: Response, user: DbUser & { _id?: any }) {
  if ("_id" in user && typeof user._id !== "undefined") {
    const token = generateAuthToken(user._id);
    const loggedInUser = clientify(user);
    res.header(authTokenKey, token).status(200).send(loggedInUser);
  } else {
    throw new Error("A valid user id is required here.");
  }
}
