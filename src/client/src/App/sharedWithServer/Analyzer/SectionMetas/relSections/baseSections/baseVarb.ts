import { Obj } from "../../../../utils/Obj";
import { Spread } from "../../../../utils/Obj/merge";

const baseValueTypeNames = [
  "number",
  "boolean",
  "string",
  "stringArray",
  "numObj",
] as const;

export type BaseValueTypeName = typeof baseValueTypeNames[number];
type ValTypeProp<T extends BaseValueTypeName = BaseValueTypeName> = {
  valueTypeName: T;
};
function valTypeProp<T extends BaseValueTypeName>(typeName: T): ValTypeProp<T> {
  return { valueTypeName: typeName };
}

type SharedGeneralBaseVarb = {
  selectable: boolean;
};
export type GeneralBaseVarb = Spread<[ValTypeProp, SharedGeneralBaseVarb]>;

function checkDefaultBase<D extends SharedGeneralBaseVarb>(def: D): D {
  return def;
}
const defaultBaseVarb: {
  selectable: true;
} = {
  selectable: true,
};
checkDefaultBase(defaultBaseVarb);
type Default = typeof defaultBaseVarb;

export const baseVarb = {
  schema<B extends Partial<GeneralBaseVarb> = {}>(
    generalBaseVarb?: B
  ): Spread<[Default, B]> {
    return Obj.merge(defaultBaseVarb, generalBaseVarb ?? ({} as B));
  },
  type<
    T extends BaseValueTypeName,
    B extends Partial<SharedGeneralBaseVarb> = {}
  >(
    typeName: T,
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<T>]>]> {
    type FirstSpread = Spread<[B, ValTypeProp<T>]>;
    const test2 = Obj.merge(
      sharedBaseVarb ?? ({} as B),
      valTypeProp(typeName)
    ) as FirstSpread;
    return this.schema(test2) as Spread<[Default, FirstSpread]>;
  },
  numObj<B extends Partial<SharedGeneralBaseVarb> = {}>(
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<"numObj">]>]> {
    return this.type("numObj", sharedBaseVarb);
  },
  string<B extends Partial<SharedGeneralBaseVarb> = {}>(
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<"string">]>]> {
    return this.type("string", sharedBaseVarb);
  },
  boolean<B extends Partial<SharedGeneralBaseVarb> = {}>(
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<"boolean">]>]> {
    return this.type("boolean", sharedBaseVarb);
  },
  stringArray<B extends Partial<SharedGeneralBaseVarb> = {}>(
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<"stringArray">]>]> {
    return this.type("stringArray", sharedBaseVarb);
  },
  number<B extends Partial<SharedGeneralBaseVarb> = {}>(
    sharedBaseVarb?: B
  ): Spread<[Default, Spread<[B, ValTypeProp<"number">]>]> {
    return this.type("number", sharedBaseVarb);
  },
};
