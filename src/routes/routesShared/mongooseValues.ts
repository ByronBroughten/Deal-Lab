import { validateInEntityValue } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { NumObj } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/NumObj";
import {
  validateChangeSaving,
  validateChangesToSave,
} from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/sectionChanges";
import { StringObj } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import {
  UnionValueName,
  unionValueNames,
} from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { valueMetas } from "../../client/src/App/sharedWithServer/SectionsMeta/values/valueMetas";
import { ValueName } from "../../client/src/App/sharedWithServer/SectionsMeta/values/ValueName";
import {
  mFromValidator,
  mInEntities,
  reqMonNumber,
  reqMonString,
} from "../../utils/mongoose";

const checkValueSchemas = <T extends Record<ValueName, any>>(t: T): T => t;

const mNumObj: Record<keyof NumObj, any> = {
  mainText: reqMonString,
  entities: mInEntities,
  solvableText: reqMonString,
};

const mStringObj: Record<keyof StringObj, any> = {
  mainText: reqMonString,
  entities: mInEntities,
};

const unions = unionValueNames.reduce((unions, name) => {
  unions[name] = mFromValidator(valueMetas[name].validate);
  return unions;
}, {} as Record<UnionValueName, any>);

export const mongooseValues = checkValueSchemas({
  number: reqMonNumber,
  dateTime: reqMonNumber,
  boolean: { type: Boolean, required: true },
  string: reqMonString,
  stringArray: [reqMonString],
  stringObj: mStringObj,
  numObj: mNumObj,
  inEntityValue: mFromValidator(validateInEntityValue, false),
  changesToSave: mFromValidator(validateChangesToSave),
  changesSaving: mFromValidator(validateChangeSaving),
  ...unions,
});
