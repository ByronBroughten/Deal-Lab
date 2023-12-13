import mongoose, { Schema } from "mongoose";
import { sectionsMeta } from "../client/src/App/sharedWithServer/SectionsMeta";
import { SectionName } from "../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { VarbName } from "../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  getChildNames,
} from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { DbSectionPack } from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  DbSectionName,
  DbStoreName,
  dbStoreNames,
  dbStoreSectionName,
} from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { selfAndDescSectionNames } from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DescendantName";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { RawSection } from "../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { ResStatusError } from "../useErrorHandling";
import { mongooseId, mongooseValues } from "./mongooseValues";

export type DbSectionsModelCore = RawDbUser & { _id: mongoose.Types.ObjectId };

export interface RawDbUser extends RawDbUserStores, UniqueValues {}
type RawDbUserStores = {
  [CN in DbStoreName]: DbSectionPack<CN>[];
};
type UniqueValues = {
  authId: string;
  email: string;
  childDbIds: Record<DbStoreName, string[]>;
};
type SchemaKeys = keyof RawDbUser;

export const DbUserModel = mongoose.model<DbSectionsModelCore>(
  "user",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<SchemaKeys, any>> {
  const schemaFrame = dbStoreNames.reduce(
    (frame, storeName) => {
      const sectionName = dbStoreSectionName(storeName);
      frame[storeName] = [makeMongooseSectionPack(sectionName)];
      return frame;
    },
    {
      authId: mongooseValues.string,
      email: mongooseValues.string,
      childDbIds: makeMongooseChildDbIds(),
    } as Record<SchemaKeys, any>
  );
  return new Schema(schemaFrame);
}

function makeMongooseChildDbIds(): Schema<Record<DbStoreName, any>> {
  const schemaFrame = dbStoreNames.reduce((frame, storeName) => {
    frame[storeName] = mongooseValues.stringArray;
    return frame;
  }, {} as Record<DbStoreName, any>);
  return new Schema(schemaFrame);
}

function makeMongooseSectionPack<SN extends DbSectionName>(sectionName: SN) {
  const schemaFrame: Record<keyof SectionPack, any> = {
    dbId: mongooseId,
    sectionName: {
      ...mongooseValues.string,
      // validate: (v: any) => v === sectionName,
    },
    rawSections: makeMongooseRawSections(sectionName),
  };
  return new Schema(schemaFrame);
}

function makeMongooseRawSections<SN extends DbSectionName>(
  sectionName: SN
): Schema<any> {
  const sectionNames = selfAndDescSectionNames(sectionName);
  const schemaFrame = sectionNames.reduce((frame, selfOrDescName) => {
    frame[selfOrDescName] = [makeMongooseRawSection(selfOrDescName)];
    return frame;
  }, {} as Record<SectionName, any>);
  return new Schema(schemaFrame);
}
function makeMongooseRawSection<SN extends SectionName>(
  sectionName: SN
): Schema<any> {
  const schemaFrame: Record<keyof RawSection, any> = {
    spNum: mongooseValues.number,
    dbId: mongooseId,
    childSpNums: makeMongooseChildSpNums(sectionName),
    sectionValues: makeMongooseVarbs(sectionName),
  };
  return new Schema(schemaFrame);
}
function makeMongooseVarbs<SN extends SectionName>(
  sectionName: SN
): Schema<any> {
  const sectionMeta = sectionsMeta.get(sectionName);
  const varbNames = sectionMeta.varbNamesNext;
  const frame = varbNames.reduce((monVarbs, varbName) => {
    const { valueName } = sectionMeta.varb(varbName);
    monVarbs[varbName] = mongooseValues[valueName];
    return monVarbs;
  }, {} as Record<VarbName<SN>, any>);
  return new Schema(frame);
}
function makeMongooseChildSpNums<SN extends SectionName>(
  sectionName: SN
): Schema<any> {
  const childNames = getChildNames(sectionName);
  const frame = childNames.reduce((childIds, childName) => {
    childIds[childName] = [mongooseValues.number];
    return childIds;
  }, {} as Record<ChildName<SN>, any>);
  return new Schema(frame);
}

export async function getUserById(userId: string) {
  const user = await DbUserModel.findById(userId, undefined, {
    new: true,
    lean: true,
    useFindAndModify: false,
  });
  if (user) {
    return user;
  } else {
    throw new ResStatusError({
      errorMessage: `User with id ${userId} not found`,
      resMessage: "User not found",
      status: 404,
    });
  }
}
