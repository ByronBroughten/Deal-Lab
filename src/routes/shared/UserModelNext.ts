import mongoose, { Schema } from "mongoose";
import { SectionPackDbRaw } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { RawSection } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { DbStoreNameNext } from "../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { SelfOrDescendantName } from "../../client/src/App/sharedWithServer/SectionMetas/relSectionTypes/ChildTypes";
import { sectionNameS } from "../../client/src/App/sharedWithServer/SectionMetas/SectionName";
import { monSchemas } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { UserDbRaw } from "./UserDbNext";

export const UserModelNext = mongoose.model<UserDbRaw>(
  "userNext",
  makeMongooseUserSchema()
);

export function createUserModel(modelName: string) {
  return mongoose.model<UserDbRaw>(modelName, makeMongooseUserSchema());
}

function makeMongooseUserSchema(): Schema<Record<DbStoreNameNext, any>> {
  const partial: Partial<Record<DbStoreNameNext, any>> = {};
  for (const sectionName of sectionNameS.arrs.fe.dbStoreNext) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<DbStoreNameNext, any>;
  return new Schema(frame);
}

export function makeMongooseSectionPack() {
  const schemaFrame: Record<keyof SectionPackDbRaw, any> = {
    dbId: monSchemas.reqDbId,
    rawSections: {
      type: Map,
      of: [makeMongooseSection()],
    },
  };
  return new Schema(schemaFrame);
}

export function makeMongooseSection() {
  const schemaFrame: Record<keyof RawSection, any> = {
    dbId: monSchemas.reqDbId,
    dbVarbs: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    childDbIds: {
      type: Map,
      of: [monSchemas.string],
    },
  };
  return new Schema(schemaFrame);
}

export const modelPath = {
  firstSectionPack(packName: DbStoreNameNext) {
    return `${packName}.0`;
  },
  firstSectionPackSection<PN extends DbStoreNameNext>(
    packName: PN,
    sectionName: SelfOrDescendantName<PN, "db">
  ) {
    return `${this.firstSectionPack(packName)}.rawSections.${sectionName}.0`;
  },
  firstSectionPackSectionVarb<PN extends DbStoreNameNext>(
    packName: PN,
    sectionName: SelfOrDescendantName<PN, "db">,
    varbName: string
  ) {
    return `${this.firstSectionPackSection(
      packName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};
