import mongoose, { Schema } from "mongoose";
import { RawSection } from "../../client/src/App/sharedWithServer/Analyzer/RawSectionPack/RawSection";
import {
  SectionNam,
  SectionName,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { monSchemas } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { UserDbRaw } from "./UserDbNext";
import { SectionPackDbRaw } from "./UserDbNext/SectionPackDb";

export const UserModelNext = mongoose.model<UserDbRaw>(
  "user",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<SectionName<"dbStore">, any>> {
  const partial: Partial<Record<SectionName<"dbStore">, any>> = {};
  for (const sectionName of SectionNam.arrs.fe.dbStore) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<SectionName<"dbStore">, any>;
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
