import mongoose from "mongoose";
import { GuestAccessSectionPackArrs } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import {
  DbSectionName,
  dbStoreNames,
} from "../../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreNameS } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { Arr } from "../../../../../client/src/App/sharedWithServer/utils/Arr";

export type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

const userInitSectionNames = Arr.extractStrict(dbStoreNames, [
  "user",
  "serverOnlyUser",
  "stripeInfo",
] as const);
type UserSectionName = typeof userInitSectionNames[number];
export type UserSectionPackArrs = {
  [SN in UserSectionName]: SectionPack<SN>[];
};

const initFullNames = [
  ...userInitSectionNames,
  ...feStoreNameS.arrs.fullIndex,
] as const;

export const initEmptyNames = Arr.excludeStrict(dbStoreNames, initFullNames);
type InitEmptyName = typeof initEmptyNames[number];
export type InitEmptyPackArrs = {
  [CN in InitEmptyName]: SectionPack<DbSectionName<CN>>[];
};

export interface MakeDbUserProps
  extends UserSectionPackArrs,
    GuestAccessSectionPackArrs {
  _id?: mongoose.Types.ObjectId;
}
