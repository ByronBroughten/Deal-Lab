import mongoose, { Document } from "mongoose";
import { OneDbSectionVarbInfo } from "../client/src/sharedWithServer/SectionInfo/DbStoreInfo";
import { SectionName } from "../client/src/sharedWithServer/sectionVarbsConfig/SectionName";
import { DbStoreName } from "../client/src/sharedWithServer/sectionVarbsConfigDerived/sectionChildrenDerived/DbStoreName";
import { ResStatusError } from "../useErrorHandling";
import { DbSectionsModelCore } from "./DbUserModel";

export const queryOptions = {
  // new: true,
  lean: true,
  useFindAndModify: false,
} as const;

export class UserNotFoundError extends ResStatusError {}
export class SectionPackNotFoundError extends ResStatusError {}

export interface DbSectionsRaw extends DbSectionsModelCore, Document<any, any> {
  _id: mongoose.Types.ObjectId;
}

export type DbUserSpecifierType = keyof typeof dbUserFilters;
export const dbUserFilters = {
  userId(userId: string) {
    return { _id: userId } as const;
  },
  authId(authId: string) {
    const path = modelPath.firstSectionVarb({
      storeName: "authInfoPrivate",
      sectionName: "authInfoPrivate",
      varbName: "authId",
    });
    return { [path]: authId };
  },
  customerId(customerId: string) {
    const path = modelPath.firstSectionVarb({
      storeName: "stripeInfoPrivate",
      sectionName: "stripeInfoPrivate",
      varbName: "customerId",
    });
    return { [path]: customerId };
  },
  email(email: string) {
    const path = modelPath.firstSectionVarb({
      storeName: "userInfo",
      sectionName: "userInfo",
      varbName: "email",
    });
    return { [path]: email } as const;
  },
} as const;

export const modelPath = {
  firstSectionPack(storeName: DbStoreName) {
    return `${storeName}.0`;
  },
  firstSectionPackSection<CN extends DbStoreName>(
    storeName: CN,
    sectionName: SectionName
  ) {
    return `${this.firstSectionPack(storeName)}.rawSections.${sectionName}.0`;
  },
  firstSectionVarb<CN extends DbStoreName, SN extends SectionName>({
    storeName,
    sectionName,
    varbName,
  }: OneDbSectionVarbInfo<CN, SN>) {
    return `${this.firstSectionPackSection(
      storeName,
      sectionName
    )}.sectionValues.${varbName}`;
  },
};
