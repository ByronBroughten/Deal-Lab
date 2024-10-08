import { Obj } from "../../../utils/Obj";
import { validateS } from "../../../utils/validateS";
import { validateValueInEntities } from "./stateValuesShared/entities";
import { EntitiesProp, MainTextProp } from "./stateValuesShared/ValueObj";

export interface StringObj extends EntitiesProp, MainTextProp {}

export function hasEntitiesProp(value: any): value is EntitiesProp {
  if (Obj.isObjToAny(value) && Array.isArray(value.entities)) {
    return true;
  } else {
    return false;
  }
}

function isStringObj(value: any): value is StringObj {
  return (
    Obj.isObjToAny(value) &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}

function validateStringObj(value: any): StringObj {
  const obj = Obj.validateObjToAny(value) as StringObj;
  return {
    mainText: validateS.stringOneLine(obj.mainText),
    entities: validateValueInEntities(obj.entities),
  };
}

export function stringObj(mainText: string): StringObj {
  return {
    mainText,
    entities: [],
  };
}

const initDefaultStringObj = ({
  mainText = "",
  entities = [],
}: Partial<StringObj> = {}) => ({ mainText, entities });

export const stringObjMeta = {
  is: isStringObj,
  validate: validateStringObj,
  initDefault: initDefaultStringObj,
};
