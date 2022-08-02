import mongoose, { Schema } from "mongoose";
import { SectionVarbName } from "../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { DbSectionPack } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbSectionName,
  DbStoreName,
  dbStoreNames,
} from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SelfOrDescendantSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DescendantSectionName";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { RawSection } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { VarbValue } from "../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/valueMetaTypes";
import { monSchemas } from "../client/src/App/sharedWithServer/utils/mongoose";

export type DbSectionsModelCore = RawDbUser & { _id: mongoose.Types.ObjectId };

export type RawDbUser = {
  [CN in DbStoreName]: DbSectionPack<CN>[];
};

export const DbSectionsModel = mongoose.model<DbSectionsModelCore>(
  "user",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<DbStoreName, any>> {
  const partial: Partial<Record<DbStoreName, any>> = {};
  for (const sectionName of dbStoreNames) {
    partial[sectionName] = [makeMongooseSectionPack()];
  }
  const frame = partial as Record<DbStoreName, any>;
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
  firstSectionPack(storeName: DbStoreName) {
    return `${storeName}.0`;
  },
  firstSectionPackSection<CN extends DbStoreName>(
    storeName: CN,
    sectionName: SelfOrDescendantSectionName<DbSectionName<CN>>
  ) {
    return `${this.firstSectionPack(storeName)}.rawSections.${sectionName}.0`;
  },
  firstSectionVarb<
    CN extends DbStoreName,
    SN extends SelfOrDescendantSectionName<DbSectionName<CN>>
  >({ storeName, sectionName, varbName }: FirstSectionVarbPathProps<CN, SN>) {
    return `${this.firstSectionPackSection(
      storeName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};

type FirstSectionVarbPathProps<
  CN extends DbStoreName,
  SN extends SelfOrDescendantSectionName<DbSectionName<CN>>
> = {
  storeName: CN;
  sectionName: SN;
  varbName: SectionVarbName<SN>;
};

interface UpdateVarbProps<
  CN extends DbStoreName,
  SN extends SelfOrDescendantSectionName<DbSectionName<CN>>,
  VN extends SectionVarbName<SN>
> extends FirstSectionVarbPathProps<CN, SN> {
  varbName: VN;
  value: VarbValue<SN, VN>;
}

export const queryParameters = {
  updateVarb: <
    CN extends DbStoreName,
    SN extends SelfOrDescendantSectionName<DbSectionName<CN>>,
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
