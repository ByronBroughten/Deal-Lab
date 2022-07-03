import mongoose, { Schema } from "mongoose";
import { RawSection } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SelfOrDescendantSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DescendantSectionName";
import { monSchemas } from "../client/src/App/sharedWithServer/utils/mongoose";
import { ServerSectionName, serverSectionS } from "./ServerSectionName";

export type DbSectionsModelCore = {
  [SN in ServerSectionName]: SectionPack<SN>[];
} & { _id: mongoose.Types.ObjectId };

export const DbSectionsModel = mongoose.model<DbSectionsModelCore>(
  "userNext",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<ServerSectionName, any>> {
  const partial: Partial<Record<ServerSectionName, any>> = {};
  for (const sectionName of serverSectionS.arrs.all) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<ServerSectionName, any>;
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
  firstSectionPack(packName: ServerSectionName) {
    return `${packName}.0`;
  },
  firstSectionPackSection<PN extends ServerSectionName>(
    packName: PN,
    sectionName: SelfOrDescendantSectionName<PN>
  ) {
    return `${this.firstSectionPack(packName)}.rawSections.${sectionName}.0`;
  },
  firstSectionPackSectionVarb<PN extends ServerSectionName>(
    packName: PN,
    sectionName: SelfOrDescendantSectionName<PN>,
    varbName: string
  ) {
    return `${this.firstSectionPackSection(
      packName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};
