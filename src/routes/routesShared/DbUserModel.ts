import mongoose, { Schema } from "mongoose";
import { sectionsMeta } from "../../client/src/App/sharedWithServer/SectionsMeta";
import { VarbName } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  getChildNames,
} from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { DbSectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  OneDbSectionValueInfo,
  OneDbSectionVarbInfo,
} from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreInfo";
import {
  DbSectionName,
  DbSelfOrDescendantSn,
  DbStoreName,
  dbStoreNames,
  dbStoreSectionName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import {
  getSelfAndDescendantNames,
  SelfOrDescendantSectionName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DescendantSectionName";
import { SectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { RawSection } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { SectionName } from "../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { monSchemas } from "../../client/src/App/sharedWithServer/utils/mongoose";

export type DbSectionsModelCore = RawDbUser & { _id: mongoose.Types.ObjectId };

export type RawDbUser = {
  [CN in DbStoreName]: DbSectionPack<CN>[];
};

export const DbUserModel = mongoose.model<DbSectionsModelCore>(
  "user",
  makeMongooseUserSchema()
);

function makeMongooseUserSchema(): Schema<Record<DbStoreName, any>> {
  const schemaFrame = dbStoreNames.reduce((frame, storeName) => {
    const sectionName = dbStoreSectionName(storeName);
    frame[storeName] = [monSectionPack(sectionName)];
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
  const selfOrDescNames = getSelfAndDescendantNames(sectionName);
  const schemaFrame = selfOrDescNames.reduce((frame, selfOrDescName) => {
    frame[selfOrDescName] = [monRawSection(selfOrDescName)];
    return frame;
  }, {} as Record<SelfOrDescendantSectionName<SN>, any>);
  return new Schema(schemaFrame);
}
function monRawSection<SN extends SectionName>(sectionName: SN): Schema<any> {
  const schemaFrame: Record<keyof RawSection, any> = {
    spNum: monSchemas.reqNumber,
    dbId: monSchemas.reqId,
    childSpNums: monChildSpNums(sectionName),
    dbVarbs: monDbVarbs(sectionName),
  };
  return new Schema(schemaFrame);
}
function monDbVarbs<SN extends SectionName>(sectionName: SN): Schema<any> {
  const sectionMeta = sectionsMeta.get(sectionName);
  const { varbNames } = sectionMeta;
  const frame = varbNames.reduce((monVarbs, varbName) => {
    const valueMetas = sectionMeta.varb(varbName).value;
    monVarbs[varbName] = valueMetas.mon;
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
    sectionName: DbSelfOrDescendantSn<CN>
  ) {
    return `${this.firstSectionPack(storeName)}.rawSections.${sectionName}.0`;
  },
  firstSectionVarb<
    CN extends DbStoreName,
    SN extends DbSelfOrDescendantSn<CN>
  >({ storeName, sectionName, varbName }: OneDbSectionVarbInfo<CN, SN>) {
    return `${this.firstSectionPackSection(
      storeName,
      sectionName
    )}.dbVarbs.${varbName}`;
  },
};

export const queryParameters = {
  updateVarb: <
    CN extends DbStoreName,
    SN extends DbSelfOrDescendantSn<CN>,
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
