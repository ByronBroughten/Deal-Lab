import { Schema } from "mongoose";
import { validateInEntityValue } from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { NumObj } from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/NumObj";
import { StringObj } from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import {
  validateChangeSaving,
  validateChangesToSave,
} from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/sectionChanges";
import {
  UnionValueName,
  unionValueNames,
} from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { validateValueInEntities } from "../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import { ValueName } from "../client/src/App/sharedWithServer/SectionsMeta/values/ValueName";
import { valueMetas } from "../client/src/App/sharedWithServer/SectionsMeta/values/valueMetas";
import { dbLimits } from "../client/src/App/sharedWithServer/utils/dbLimits";
import { validateS } from "../client/src/App/sharedWithServer/validateS";

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
  unions[name] = mFromValidator(valueMetas[name].validate);
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
