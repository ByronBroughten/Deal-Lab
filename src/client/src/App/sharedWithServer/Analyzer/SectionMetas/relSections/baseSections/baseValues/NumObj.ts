import { cloneDeep, round } from "lodash";
import { z } from "zod";
import { isStringRationalNumber } from "../../../../../utils/Str";
import array from "../../../../../utils/Arr";
import { Mth } from "../../../../../utils/math";
import { evaluate } from "mathjs";
import { Obj } from "../../../../../utils/Obj";
import { InEntities, InEntity, zInEntities } from "./NumObj/numObjInEntitites";

export const zDbNumObj = z.object({
  editorText: z.string(),
  entities: zInEntities,
});
export type DbNumObj = z.infer<typeof zDbNumObj> & { entities: InEntities };

export function isDbNumObj(value: any): value is DbNumObj {
  // quick and imprecise is fine for this
  return typeof value.editorText === "string" && Array.isArray(value.entities);
}
export function dbNumObj(
  editorText: string | number,
  entities: InEntities = []
): DbNumObj {
  return {
    editorText: `${editorText}`,
    entities,
  };
}

export type EntitiesAndEditorText = DbNumObj;
export type NumObjCore = EntitiesAndEditorText;
type NumObjCache = {
  solvableText: string;
  number: NumObjNumber;
};

export type NumObjNumber = number | "?";
export class NumObj {
  constructor(
    readonly core: NumObjCore,
    readonly cache: NumObjCache = { solvableText: "", number: "?" }
  ) {}
  get editorText(): string {
    return this.core.editorText;
  }
  get solvableText(): string {
    return this.cache.solvableText;
  }
  get entities(): InEntities {
    return cloneDeep(this.core.entities);
  }
  get number(): NumObjNumber {
    return this.cache.number;
  }
  get editorTextStatus() {
    if (["", "-"].includes(this.editorText as any)) return "empty";
    if (isStringRationalNumber(this.editorText)) return "number";
    else return "solvableText";
  }
  get dbNumObj(): DbNumObj {
    return this.core;
  }
  get base(): DbNumObj {
    return this.core;
  }
  removeEntity(entityId: string): NumObj {
    const entities = array.findAndRmClone(this.entities, (entity) => {
      return entity.entityId === entityId;
    });
    return this.updateCore({ entities });
  }
  updateCore(partial: Partial<NumObjCore>): NumObj {
    // when the core is updated, the cache is cleared, right?
    return new NumObj(
      {
        ...this.core,
        ...partial,
      },
      this.cache
    );
  }

  updateCache(partial: Partial<NumObjCache>): NumObj {
    return new NumObj(this.core, { ...this.cache, ...partial });
  }
  addEntity(entity: InEntity): NumObj {
    return this.updateCore({
      entities: [...this.entities, entity],
    });
  }
  clone() {
    return new NumObj(cloneDeep(this.core), cloneDeep(this.cache));
  }

  static roundTo = {
    percent: 3,
    decimal: 5,
    cents: 2,
  } as const;

  static finishingTouch = {
    divideToPercent(num: number) {
      return Mth.decimalToPercent(num);
    },
  };
  static init(initValue: string | number): NumObj {
    return new NumObj({
      editorText: `${initValue}`,
      entities: [],
    });
  }
  static solveText(
    text: string,
    roundTo: number,
    finishingTouch?: FinishingTouch
  ): NumObjNumber {
    // the editor should handle when someone validly types left to right
    if (text[text.length - 1] === ".")
      // if there's a dot at the end, they could be about to enter a number
      text = text.substring(0, text.length - 1);

    if (text[text.length - 1] === "-")
      // if there's a minus at the end, they might be subtracting
      // or making a negative number, which could follow another operator
      text = text.substring(0, text.length - 1);

    if (Mth.is(text[text.length - 1], "arithmeticOperator"))
      // if there's an operator before those things, it's valid
      text = text.substring(0, text.length - 1);

    try {
      let num = evaluate(text);
      if (typeof num === "number" && finishingTouch) {
        num = this.finishingTouch[finishingTouch](num);
        return round(num, roundTo);
      } else return "?";
    } catch (ex) {
      return "?";
    }
  }

  static isFinishingTouch(
    value: any
  ): value is keyof typeof this.finishingTouch {
    return Obj.keys(this.finishingTouch).includes(value);
  }
}

export type FinishingTouch = keyof typeof NumObj.finishingTouch;

export const zNumObj = z
  .any()
  .refine(
    (value) => value instanceof NumObj,
    "Expected a numObj but received something else."
  );
