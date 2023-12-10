import mongoose, { Schema } from "mongoose";
import { validateValueInEntities } from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import { dbLimits } from "../client/src/App/sharedWithServer/utils/dbLimits";
import { validateS } from "../client/src/App/sharedWithServer/validateS";

export function makeMongooseObjectId() {
  return new mongoose.Types.ObjectId();
}

export function mFromValidator(
  validator: (value: any) => any,
  required?: boolean
) {
  return {
    type: Schema.Types.Mixed,
    required: required ?? true,
    validate: {
      validator: validateS.makeIsChecker(validator),
    },
  };
}

export const mInEntities = mFromValidator(validateValueInEntities);

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

export const monSchemas = {
  number: monNumber,
  reqNumber: reqMonNumber,
  string: monString,
  reqString: reqMonString,
  get reqStringArr() {
    return [this.reqString];
  },
  reqId: {
    type: String,
    maxLength: dbLimits.dbId.length,
    minLength: dbLimits.dbId.length,
    required: true,
  },
  fromValidator: mFromValidator,
};
