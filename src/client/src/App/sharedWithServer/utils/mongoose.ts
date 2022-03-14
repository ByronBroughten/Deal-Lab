import mongoose from "mongoose";
import { dbLimits } from "./validatorConstraints";

export function makeObjectId() {
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
