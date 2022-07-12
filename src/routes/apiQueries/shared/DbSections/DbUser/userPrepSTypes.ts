import mongoose from "mongoose";
import { GuestAccessSectionPackArrs } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { SectionPack } from "../../../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { DbSectionName } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { dbStoreNameS } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/dbStoreNameArrs";
import { Arr } from "../../../../../client/src/App/sharedWithServer/utils/Arr";
import { serverSectionNames } from "../../../../ServerStoreName";

export type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

const userSectionNames = Arr.extractStrict(serverSectionNames, [
  "user",
  "serverOnlyUser",
] as const);
type UserSectionName = typeof userSectionNames[number];
export type UserSectionPackArrs = {
  [SN in UserSectionName]: SectionPack<SN>[];
};

const initFullNames = [
  ...userSectionNames,
  ...dbStoreNameS.arrs.fullIndex,
] as const;

export const initEmptyNames = Arr.excludeStrict(
  serverSectionNames,
  initFullNames
);
type InitEmptyName = typeof initEmptyNames[number];
export type InitEmptyPackArrs = {
  [CN in InitEmptyName]: SectionPack<DbSectionName<CN>>[];
};

export interface MakeDbUserProps
  extends UserSectionPackArrs,
    GuestAccessSectionPackArrs {
  _id?: mongoose.Types.ObjectId;
}
