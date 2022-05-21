import { cloneDeep } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { Arr } from "../../../utils/Arr";
import { reqMonString } from "../../../utils/mongoose";
import { isStringRationalNumber } from "../../../utils/Str";
import {
  DbVarbInfo,
  RelVarbInfo,
} from "../../relSections/rel/relVarbInfoTypes";
import { InEntities, InEntity, mEntityFrame, zInEntities } from "./entities";
import { NumObjUpdateFnName } from "./updateFnNames";

export const zDbNumObj = z.object({
  editorText: z.string(),
  entities: zInEntities,
});
export type DbNumObj = z.infer<typeof zDbNumObj> & { entities: InEntities };

export function isDbNumObj(value: any): value is DbNumObj {
  // speed is important for this
  return (
    typeof value === "object" &&
    "editorText" in value &&
    typeof value.editorText === "string" &&
    Array.isArray(value.entities)
  );
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
export type NumObjCache = {
  solvableText: string;
  number: NumObjNumber;
};

export type GetSolvableTextProps = {
  editorText: string;
  entities: InEntities;
  updateFnName?: NumObjUpdateFnName;
};

type UpdateVarbInfo = RelVarbInfo | DbVarbInfo;
export type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
export type FailedVarbs = FailedVarb[];
export type NumObjNumber = number | "?";

const undividable = ["?", 0];
export class NumObj {
  constructor(
    readonly core: NumObjCore,
    readonly cache: NumObjCache = { solvableText: "", number: "?" }
  ) {
    if ("core" in core) {
      throw new Error("That is not a valid numObj core.");
    }
  }
  get isDividable() {
    return !undividable.includes(this.number);
  }

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
  get editorTextNumber(): string {
    return this.number === "?" ? "" : `${this.number}`;
  }
  get numberStrict(): number {
    const num = this.cache.number;
    if (typeof num === "number") return num;
    throw new Error("If this getter is used, num must be a number.");
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
    const entities = Arr.findAndRmClone(this.entities, (entity) => {
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
  static init(initValue: string | number): NumObj {
    return new NumObj({
      editorText: `${initValue}`,
      entities: [],
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
