import mongoose, { Schema } from "mongoose";
import { SectionPackDbRaw } from "../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { RawSection } from "../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { SelfOrDescendantName } from "../client/src/App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { monSchemas } from "../client/src/App/sharedWithServer/utils/mongoose";
import { ServerSectionName, serverSectionS } from "./ServerSectionName";
import { UserDbRaw } from "./ServerUser";

export const UserModel = mongoose.model<UserDbRaw>(
  "userNext",
  makeMongooseUserSchema()
);

export function createUserModel(modelName: string) {
  return mongoose.model<UserDbRaw>(modelName, makeMongooseUserSchema());
}

function makeMongooseUserSchema(): Schema<Record<ServerSectionName, any>> {
  const partial: Partial<Record<ServerSectionName, any>> = {};
  for (const sectionName of serverSectionS.arrs.all) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<ServerSectionName, any>;
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
  firstSectionPack(packName: ServerSectionName) {
    return `${packName}.0`;
  },
  firstSectionPackSection<PN extends ServerSectionName>(
    packName: PN,
    sectionName: SelfOrDescendantName<PN, "db">
  ) {
    return `${this.firstSectionPack(packName)}.rawSections.${sectionName}.0`;
  },
  firstSectionPackSectionVarb<PN extends ServerSectionName>(
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
