import mongoose, { Schema } from "mongoose";
import { RawSection } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SectionVarbName } from "../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { SelfOrDescendantSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DescendantSectionName";
import { VarbValue } from "../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/valueMetaTypes";
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
  "user",
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
  firstSectionPack(storeName: ServerStoreName) {
    return `${storeName}.0`;
  },
  firstSectionPackSection<CN extends ServerStoreName>(
    storeName: CN,
    sectionName: SelfOrDescendantSectionName<ServerSectionName<CN>>
  ) {
    return `${this.firstSectionPack(storeName)}.rawSections.${sectionName}.0`;
  },
  firstSectionVarb<
    CN extends ServerStoreName,
    SN extends SelfOrDescendantSectionName<ServerSectionName<CN>>
  >({ storeName, sectionName, varbName }: FirstSectionVarbPathProps<CN, SN>) {
    return `${this.firstSectionPackSection(
      storeName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};

type FirstSectionVarbPathProps<
  CN extends ServerStoreName,
  SN extends SelfOrDescendantSectionName<ServerSectionName<CN>>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: SectionVarbName<SN>;
};

interface UpdateVarbProps<
  CN extends ServerStoreName,
  SN extends SelfOrDescendantSectionName<ServerSectionName<CN>>,
  VN extends SectionVarbName<SN>
> extends FirstSectionVarbPathProps<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}

export const queryParameters = {
  updateVarb: <
    CN extends ServerStoreName,
    SN extends SelfOrDescendantSectionName<ServerSectionName<CN>>,
    VN extends SectionVarbName<SN>
  >({
    value,
    ...props
  }: UpdateVarbProps<CN, SN, VN>) => {
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
