import { BaseValueName } from "../../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues";
import {
  reqMonNumber,
  reqMonString,
} from "../../../../client/src/App/sharedWithServer/utils/mongoose";
import { mDbNumObj } from "./mongooseNumObj";

export const mongooseValues: Record<BaseValueName, any> = {
  number: reqMonNumber,
  boolean: { type: Boolean, required: true },
  string: reqMonString,
  stringArray: [reqMonString],
  numObj: mDbNumObj,
};
