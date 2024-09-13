import { Schema } from "mongoose";
import { ValueName } from "../client/src/sharedWithServer/stateSchemas/schema1ValueNames";
import { valueTraits } from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits";
import { validateInEntityValue } from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/InEntityValue";
import { NumObj } from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/NumObj";
import {
  validateChangeSaving,
  validateChangesToSave,
} from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/sectionChanges";
import { validateValueInEntities } from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/stateValuesShared/entities";
import { StringObj } from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/StringObj";
import {
  UnionValueName,
  unionValueNames,
} from "../client/src/sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { dbLimits } from "../client/src/sharedWithServer/utils/dbLimits";
import { validateS } from "../client/src/sharedWithServer/utils/validateS";

const mInEntities = mFromValidator(validateValueInEntities);

const mString = {
  type: String,
  maxLength: dbLimits.string.maxLength,
  validate: (v: any) => typeof v === "string",
};

const mNumber = {
  type: Number,
  max: dbLimits.number.max,
  min: dbLimits.number.min,
  required: true,
};

const mNumObj: Record<keyof NumObj, any> = {
  mainText: mString,
  entities: mInEntities,
  solvableText: mString,
};

const mStringObj: Record<keyof StringObj, any> = {
  mainText: mString,
  entities: mInEntities,
};

const unions = unionValueNames.reduce((unions, name) => {
  unions[name] = mFromValidator(valueTraits[name].validate);
  return unions;
}, {} as Record<UnionValueName, any>);

export const mongooseValues = checkValueSchemas({
  number: mNumber,
  dateTime: mNumber,
  boolean: { type: Boolean, required: true },
  string: mString,
  stringArray: [mString],
  stringObj: mStringObj,
  numObj: mNumObj,
  inEntityValue: mFromValidator(validateInEntityValue, false),
  changesToSave: mFromValidator(validateChangesToSave),
  changesSaving: mFromValidator(validateChangeSaving),
  ...unions,
});

export const mongooseId = {
  type: String,
  maxLength: dbLimits.dbId.length,
  minLength: dbLimits.dbId.length,
  required: true,
};

function mFromValidator(validator: (value: any) => any, required?: boolean) {
  return {
    type: Schema.Types.Mixed,
    required: required ?? true,
    validate: {
      validator: validateS.makeIsChecker(validator),
    },
  };
}

function checkValueSchemas<T extends Record<ValueName, any>>(t: T): T {
  return t;
}
