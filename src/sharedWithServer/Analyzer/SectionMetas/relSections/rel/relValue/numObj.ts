import { cloneDeep, round } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import {
  arithmeticOperatorsArr,
  decimalToPercent,
} from "../../../../../utils/math";
import { reqMonString } from "../../../../../utils/mongoose";
import {
  isRationalNumber,
  isStringRationalNumber,
} from "../../../../../utils/Str";
import {
  InEntities,
  InEntity,
  mEntityFrame,
  zInEntities,
} from "./numObj/entities";
import { NumObjUpdateFnName } from "./numObj/updateFnNames";
import { CalcProp } from "./numObj/calculations";
import array from "../../../../../utils/Arr";
import { DbVarbInfo, RelVarbInfo } from "../relVarbInfoTypes";

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

export type EditorTextAndEntities = DbNumObj;

type FinishingTouchProps = {
  updateFnName: NumObjUpdateFnName;
  unit: NumObjUnit;
};
type SolvableProps = { solvableText: string; failedVarbs: FailedVarbs };
export type NumObjCore = EditorTextAndEntities &
  SolvableProps &
  FinishingTouchProps;

export type GetSolvableTextProps = {
  editorText: string;
  entities: InEntities;
  updateFnName?: NumObjUpdateFnName;
};

type UpdateVarbInfo = RelVarbInfo | DbVarbInfo;
export type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
export type FailedVarbs = FailedVarb[];
export type NumObjNumber = number | undefined;

export const numObjUnits = {
  percent: {
    roundTo: 4, // for now, what this is set to dictates the decimal
    // length that precedes the percent.
  },
  decimal: {
    roundTo: 4, // this must be 5 for conversion to percent's 3
  },
  money: {
    roundTo: 2,
    roundWithZeros: true,
  },
} as const;
export type NumObjUnit = keyof typeof numObjUnits;

export class NumObj {
  constructor(readonly core: NumObjCore) {}
  get editorText(): string {
    return this.core.editorText;
  }
  get solvableText(): string {
    return this.core.solvableText;
  }
  get updateFnName(): NumObjUpdateFnName {
    return this.core.updateFnName;
  }
  get entities(): InEntities {
    return cloneDeep(this.core.entities);
  }
  get failedVarbs() {
    return cloneDeep(this.core.failedVarbs);
  }
  get number(): CalcProp {
    const number = NumObj.solveText(this.solvableText, this.core.unit);
    if (isRationalNumber(number)) return this.doFinishingTouches(number);
    else return "?";
  }
  get editorTextStatus() {
    if (["", "-"].includes(this.editorText as any)) return "empty";
    if (isStringRationalNumber(this.editorText)) return "number";
    else return "solvableText";
  }
  get dbNumObj(): DbNumObj {
    return this.base;
  }
  get base(): DbNumObj {
    return {
      editorText: this.editorText,
      entities: this.entities,
    };
  }
  static solveText(text: string, unit: NumObjUnit): CalcProp {
    // no errors should be thrown as a person is validly typing front to back
    if (text[text.length - 1] === ".")
      // if there's a dot at the end, they could be about to enter a number
      text = text.substring(0, text.length - 1);

    if (text[text.length - 1] === "-")
      // if there's a minus at the end, they might be subtracting
      // or making a negative number, which could follow another operator
      text = text.substring(0, text.length - 1);
    if (arithmeticOperatorsArr.includes(text[text.length - 1]))
      // if there's an operator before those things, it's valid
      text = text.substring(0, text.length - 1);

    try {
      let num = new Function("return " + text)();
      // Do I need to say what time of output each number is?

      if (typeof num === "number") num = round(num, numObjUnits[unit].roundTo);
      return num;
    } catch {
      return "?";
    }
  }
  doFinishingTouches(number: number): number {
    if (this.updateFnName === "divideToPercent")
      number = round(decimalToPercent(number), numObjUnits.percent.roundTo);
    return number;
  }
  removeEntity(entityId: string): NumObj {
    const entities = array.findAndRmClone(this.entities, (entity) => {
      return entity.entityId === entityId;
    });
    return this.updateCore({ entities });
  }
  updateCore(partial: Partial<NumObjCore>): NumObj {
    return new NumObj({
      ...this.core,
      ...partial,
    });
  }
  addEntity(entity: InEntity): NumObj {
    return this.updateCore({
      entities: [...this.entities, entity],
    });
  }
  clone() {
    return new NumObj(cloneDeep(this.core));
  }
  static init(
    initValue: string,
    updateFnName: NumObjUpdateFnName,
    unit: NumObjUnit
  ): NumObj {
    const editorText = `${initValue}`;
    return new NumObj({
      editorText,
      updateFnName,
      solvableText: editorText,
      entities: [],
      failedVarbs: [],
      unit,
    });
  }
}

export const zNumObj = z
  .any()
  .refine(
    (value) => value instanceof NumObj,
    "Expected a numObj but received something else."
  );

export const mDbNumObj: { [key in keyof DbNumObj]: any } = {
  editorText: reqMonString,
  entities: [new Schema(mEntityFrame)],
};
