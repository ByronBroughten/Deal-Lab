import mongoose from "mongoose";
import {
  maxNumber,
  maxStringLength,
  nanoIdLength,
} from "./validatorConstraints";

export function makeObjectId() {
  return mongoose.Types.ObjectId();
}

export const monObjId = {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
};

export const monNumber = {
  type: Number,
  max: maxNumber,
  min: -maxNumber,
};
export const reqMonNumber = {
  ...monNumber,
  required: true,
};
export const monString = {
  type: String,
  maxLength: maxStringLength,
};
export const reqMonString = {
  ...monString,
  validate: (v: any) => typeof v === "string",
};
export const reqMonDbId = {
  type: String,
  maxLength: nanoIdLength,
  minLength: nanoIdLength,
  required: true,
};
