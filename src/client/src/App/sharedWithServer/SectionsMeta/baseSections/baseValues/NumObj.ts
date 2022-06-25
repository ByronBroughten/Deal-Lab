import { cloneDeep } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { Arr } from "../../../utils/Arr";
import { mathS, NotANumberError } from "../../../utils/math";
import { reqMonString } from "../../../utils/mongoose";
import { Obj } from "../../../utils/Obj";
import { StrictPick } from "../../../utils/types";
import {
  DbVarbInfo,
  RelVarbInfo,
} from "../../relSections/rel/relVarbInfoTypes";
import { InEntities, InEntity, mEntityFrame, zInEntities } from "./entities";
import { NumObjUpdateFnName } from "./updateFnNames";

export const zDbNumObj = z.object({
  editorText: z.string(),
  entities: zInEntities,
  solvableText: z.string(),
  numString: z.string(),
});
export type DbNumObj = z.infer<typeof zDbNumObj> & { entities: InEntities };
export type NumObjCore = DbNumObj;
export type NumObjCache = StrictPick<NumObjCore, "solvableText" | "numString">;

export function isDbNumObj(value: any): value is DbNumObj {
  // speed is important here, which is why I don't use zod for it
  return (
    typeof value === "object" &&
    "editorText" in value &&
    typeof value.editorText === "string" &&
    Array.isArray(value.entities)
  );
}
export function dbNumObj(
  editorText: string | number,
  entities: InEntities = [],
  solvableText: string = `${editorText}`,
  numString: string = `${editorText}`
): DbNumObj {
  return {
    editorText: `${editorText}`,
    entities,
    solvableText,
    numString,
  };
}

export type EntitiesAndEditorText = StrictPick<
  DbNumObj,
  "editorText" | "entities"
>;

export type GetSolvableTextProps = {
  editorText: string;
  entities: InEntities;
  updateFnName?: NumObjUpdateFnName;
};

type UpdateVarbInfo = RelVarbInfo | DbVarbInfo;
export type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
export type FailedVarbs = FailedVarb[];
export type NumObjNumber = number | "?";

// I like the idea of NumObj having access to the rest of the state.
// I'm not sure if I would be allowed to build that out.

const undividable = ["?", 0];
export class NumObj {
  constructor(readonly core: NumObjCore) {
    if ("core" in core) {
      throw new Error("That is not a valid numObj core.");
    }
  }
  get editorText(): string {
    return this.core.editorText;
  }
  get solvableText(): string {
    return this.core.solvableText;
  }
  get entities(): InEntities {
    return cloneDeep(this.core.entities);
  }

  get cache(): NumObjCache {
    return Obj.strictPick(this.core, ["solvableText", "numString"]);
  }

  get numberStrict(): number {
    return mathS.parseFloatStrict(this.core.numString);
  }
  get number(): NumObjNumber {
    try {
      return this.numberStrict;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return "?";
      } else {
        throw ex;
      }
    }
  }

  get dbNumObj(): DbNumObj {
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
  static init(initValue: string | number): NumObj {
    return new NumObj({
      editorText: `${initValue}`,
      entities: [],
      solvableText: `${initValue}`,
      numString: `${initValue}`,
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
  solvableText: reqMonString,
  numString: reqMonString,
};
