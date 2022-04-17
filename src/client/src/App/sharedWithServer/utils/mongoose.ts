import mongoose from "mongoose";
import { dbLimits } from "./dbLimts";

export function makeMongooseObjectId() {
  return new mongoose.Types.ObjectId();
}

export const monObjId = {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
};

export const monNumber = {
  type: Number,
  max: dbLimits.number.max,
  min: dbLimits.number.min,
};
export const reqMonNumber = {
  ...monNumber,
  required: true,
};
export const monString = {
  type: String,
  maxLength: dbLimits.string.maxLength,
};
export const reqMonString = {
  ...monString,
  validate: (v: any) => typeof v === "string",
};
export const reqMonDbId = {
  type: String,
  maxLength: dbLimits.dbId.length,
  minLength: dbLimits.dbId.length,
  required: true,
};

export const monSchemas = {
  number: monNumber,
  reqNumber: reqMonNumber,
  string: monString,
  reqString: reqMonString,
  reqDbId: reqMonDbId,
};
