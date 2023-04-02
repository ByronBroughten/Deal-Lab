import { z } from "zod";
import { monSchemas } from "../../../utils/mongoose";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { mInEntities, zValueInEntities } from "./valuesShared/entities";
import { EntitiesProp, MainTextProp } from "./valuesShared/valueObj";

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

const zStringObj = z.object({
  mainText: zS.string,
  entities: zValueInEntities,
} as { [K in keyof StringObj]: any });

const mStringObj: Record<keyof StringObj, any> = {
  mainText: monSchemas.reqString,
  entities: mInEntities,
};

export const stringObjMeta = {
  is: isStringObj,
  initDefault: initDefaultStringObj,
  zod: zStringObj,
  mon: mStringObj,
};
