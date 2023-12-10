import mongoose, { Schema } from "mongoose";
import { sectionsMeta } from "../client/src/App/sharedWithServer/SectionsMeta";
import {
  OneDbSectionValueInfo,
  OneDbSectionVarbInfo,
} from "../client/src/App/sharedWithServer/SectionsMeta/SectionInfo/DbStoreInfo";
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
import { monSchemas } from "./mongooseUtils";
import { mongooseValues } from "./mongooseValues";

export type DbSectionsModelCore = RawDbUser & { _id: mongoose.Types.ObjectId };

type UniqueValues = {
  authId: string;
  email: string;
  childDbIds: Record<DbStoreName, string[]>;
};
type RawDbUserStores = {
  [CN in DbStoreName]: DbSectionPack<CN>[];
};
export interface RawDbUser extends RawDbUserStores, UniqueValues {}
type SchemaKeys = keyof RawDbUser;

export const DbUserModel = mongoose.model<DbSectionsModelCore>(
  "user",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<SchemaKeys, any>> {
  const schemaFrame = dbStoreNames.reduce(
    (frame, storeName) => {
      const sectionName = dbStoreSectionName(storeName);
      frame[storeName] = [monSectionPack(sectionName)];
      return frame;
    },
    {
      authId: monSchemas.reqString,
      email: monSchemas.reqString,
      childDbIds: makeMongooseChildDbIds(),
    } as Record<SchemaKeys, any>
  );
  return new Schema(schemaFrame);
}

function makeMongooseChildDbIds(): Schema<Record<DbStoreName, any>> {
  const schemaFrame = dbStoreNames.reduce((frame, storeName) => {
    frame[storeName] = monSchemas.reqStringArr;
    return frame;
  }, {} as Record<DbStoreName, any>);
  return new Schema(schemaFrame);
}

function monSectionPack<SN extends DbSectionName>(sectionName: SN) {
  const schemaFrame: Record<keyof SectionPack, any> = {
    dbId: monSchemas.reqId,
    sectionName: {
      ...monSchemas.reqString,
      // validate: (v: any) => v === sectionName,
    },
    rawSections: monRawSections(sectionName),
  };
  return new Schema(schemaFrame);
}

function monRawSections<SN extends DbSectionName>(
  sectionName: SN
): Schema<any> {
  const sectionNames = selfAndDescSectionNames(sectionName);
  const schemaFrame = sectionNames.reduce((frame, selfOrDescName) => {
    frame[selfOrDescName] = [monRawSection(selfOrDescName)];
    return frame;
  }, {} as Record<SectionName, any>);
  return new Schema(schemaFrame);
}
function monRawSection<SN extends SectionName>(sectionName: SN): Schema<any> {
  const schemaFrame: Record<keyof RawSection, any> = {
    spNum: monSchemas.reqNumber,
    dbId: monSchemas.reqId,
    childSpNums: monChildSpNums(sectionName),
    sectionValues: monDbVarbs(sectionName),
  };
  return new Schema(schemaFrame);
}
function monDbVarbs<SN extends SectionName>(sectionName: SN): Schema<any> {
  const sectionMeta = sectionsMeta.get(sectionName);
  const { varbNames } = sectionMeta;
  const frame = varbNames.reduce((monVarbs, varbName) => {
    const { valueName } = sectionMeta.varb(varbName);
    monVarbs[varbName] = mongooseValues[valueName];
    return monVarbs;
  }, {} as Record<string, any>);
  return new Schema(frame);
}
function monChildSpNums<SN extends SectionName>(sectionName: SN): Schema<any> {
  const childNames = getChildNames(sectionName);
  const frame = childNames.reduce((childIds, childName) => {
    childIds[childName] = [monSchemas.reqNumber];
    return childIds;
  }, {} as Record<ChildName<SN>, any>);
  return new Schema(frame);
}

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

export const queryParameters = {
  updateVarb: <
    CN extends DbStoreName,
    SN extends SectionName,
    VN extends VarbName<SN>
  >({
    value,
    ...props
  }: OneDbSectionValueInfo<CN, SN, VN>) => {
    const path = modelPath.firstSectionVarb(props);
    return {
      operation: {
        $set: { [path]: value },
      },
      options: {
        new: true,
        lean: true,
        useFindAndModify: false,
        strict: false,
        // runValidators: true,
      },
    };
  },
};

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
