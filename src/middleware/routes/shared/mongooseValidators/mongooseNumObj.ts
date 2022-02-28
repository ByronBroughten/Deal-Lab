import { Schema } from "mongoose";
import { DbNumObj } from "../../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj";
import { InEntity } from "../../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import {
  reqMonNumber,
  reqMonString,
} from "../../../../client/src/App/sharedWithServer/utils/mongoose";

const mEntityFrame: Record<keyof InEntity, any> = {
  entityId: reqMonString,
  offset: reqMonNumber,
  length: reqMonNumber,
  sectionName: reqMonString,
  varbName: reqMonString,
  id: reqMonString,
  idType: reqMonString,
  context: reqMonString,
};

export const mDbNumObj: { [key in keyof DbNumObj]: any } = {
  editorText: reqMonString,
  entities: [new Schema(mEntityFrame)],
};
