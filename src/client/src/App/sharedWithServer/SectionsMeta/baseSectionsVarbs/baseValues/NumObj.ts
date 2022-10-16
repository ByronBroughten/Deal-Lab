import { z } from "zod";
import { reqMonString } from "../../../utils/mongoose";
import { StrictPick, StrictPickPartial } from "../../../utils/types";
import { PathVarbInfo } from "../../PathInfo";
import { SectionNameByType } from "../../SectionNameByType";
import { Id } from "../id";
import {
  AbsoluteInEntity,
  InEntities,
  InEntity,
  mInEntities,
  zInEntities,
} from "./entities";

export type NumObj = {
  mainText: string;
  entities: InEntity[];
  solvableText: string;
};
export const zNumObj = z.object({
  mainText: z.string(),
  entities: zInEntities,
  solvableText: z.string(),
} as { [K in keyof NumObj]: any });
export const mDbNumObj: Record<keyof NumObj, any> = {
  mainText: reqMonString,
  entities: mInEntities,
  solvableText: reqMonString,
};
export function isNumObj(value: any): value is NumObj {
  // speed is important here, which is why we don't use zod
  return (
    typeof value === "object" &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}
export function numObj(
  mainText: string | number,
  entities: InEntities = [],
  solvableText: string = `${mainText}`
): NumObj {
  return {
    mainText: `${mainText}`,
    entities,
    solvableText,
  };
}
export type NumberOrQ = number | "?";
export type EntitiesAndEditorText = StrictPick<NumObj, "mainText" | "entities">;

type EntityNumObjPropArr = (string | NumObjProp)[];
interface NumObjProp<
  SN extends SectionNameByType<"hasGlobalVarbs"> = SectionNameByType<"hasGlobalVarbs">
> extends PathVarbInfo<SN>,
    StrictPickPartial<AbsoluteInEntity, "entitySource" | "expectedCount"> {
  text: string;
}
export function entityNumObj(propArr: EntityNumObjPropArr): NumObj {
  let mainText: string = "";
  let solvableText: string = "";
  const entities: InEntities = [];
  for (const prop of propArr) {
    if (typeof prop === "string") {
      mainText += prop;
      solvableText += prop;
    } else {
      entities.push({
        entityId: Id.make(),
        entitySource: "editor",
        expectedCount: "onlyOne",
        length: prop.text.length,
        offset: mainText.length,
        infoType: "absolutePath",
        ...prop,
      });
      mainText += prop.text;
      solvableText += "?";
    }
  }
  return {
    mainText,
    entities,
    solvableText,
  };
}
