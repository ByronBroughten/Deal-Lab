import mongoose from "mongoose";
import { GuestAccessSectionPackArrs } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { feStoreNameS } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { DbSectionPack } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  DbSectionName,
  dbStoreNames,
} from "../../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { Arr } from "../../../../../client/src/App/sharedWithServer/utils/Arr";

export type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

const userInfoStoreName = Arr.extractStrict(dbStoreNames, [
  "userInfo",
  "userInfoPrivate",
  "stripeInfoPrivate",
] as const);
type UserInfoStoreName = typeof userInfoStoreName[number];
export type UserSectionPackArrs = {
  [SN in UserInfoStoreName]: SectionPack<SN>[];
};

const initialUserStoreNames = Arr.extractStrict(dbStoreNames, [
  "authInfoPrivate",
  "userInfo",
  "userInfoPrivate",
  "stripeInfoPrivate",
] as const);
type InitialUserStoreName = typeof initialUserStoreNames[number];
export type InitialUserSectionPackArrs = {
  [SN in InitialUserStoreName]: SectionPack<SN>[];
};
export const initEmptyNamesNext = Arr.excludeStrict(
  dbStoreNames,
  initialUserStoreNames
);
type InitEmptyNameNext = typeof initEmptyNamesNext[number];
type InitialEmptySectionPackArrs = {
  [CN in InitEmptyNameNext]: DbSectionPack<CN>[];
};
export type MakeRawDbUserProps = {};

const initFullNames = [
  ...userInfoStoreName,
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
