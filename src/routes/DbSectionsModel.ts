import mongoose, { Schema } from "mongoose";
import { RawSection } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SelfOrDescendantSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DescendantSectionName";
import { monSchemas } from "../client/src/App/sharedWithServer/utils/mongoose";
import {
  ServerSectionName,
  serverSectionNames,
  ServerSectionPack,
  ServerStoreName,
} from "./ServerStoreName";

export type DbSectionsModelCore = {
  [CN in ServerStoreName]: ServerSectionPack<CN>[];
} & { _id: mongoose.Types.ObjectId };

export const DbSectionsModel = mongoose.model<DbSectionsModelCore>(
  "userNext",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<ServerStoreName, any>> {
  const partial: Partial<Record<ServerStoreName, any>> = {};
  for (const sectionName of serverSectionNames) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<ServerStoreName, any>;
  return new Schema(frame);
}

export function makeMongooseSectionPack() {
  const schemaFrame: Record<keyof SectionPack, any> = {
    sectionName: monSchemas.reqString,
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
  firstSectionPack(packName: ServerStoreName) {
    return `${packName}.0`;
  },
  firstSectionPackSection<CN extends ServerStoreName>(
    packName: CN,
    sectionName: SelfOrDescendantSectionName<ServerSectionName<CN>>
  ) {
    return `${this.firstSectionPack(packName)}.rawSections.${sectionName}.0`;
  },
  firstSectionPackSectionVarb<CN extends ServerStoreName>(
    packName: CN,
    sectionName: SelfOrDescendantSectionName<ServerSectionName<CN>>,
    varbName: string
  ) {
    return `${this.firstSectionPackSection(
      packName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};
