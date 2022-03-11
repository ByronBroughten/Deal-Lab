import { Obj } from "../../../../utils/Obj";
import { Merge } from "../../../../utils/Obj/merge";
import { BaseValueName } from "./baseValues";
import { SwitchName } from "./baseSwitch";

export type GeneralBaseVarb<T extends BaseValueName = BaseValueName> = {
  valueName: T;
  baseName: string;

  switchName: SwitchName | null;
  selectable: boolean;
};
export type BaseVarbOptions = Partial<Omit<GeneralBaseVarb, "valueName">>;
type DefaultBaseVarb<BN extends string, T extends BaseValueName> = {
  valueName: T;
  baseName: BN;

  selectable: true;
  switchName: null;
};
export type DefaultBaseSwitch<BN extends string> = BaseVarb<
  BN,
  "string",
  { selectable: false }
>;
export type BaseVarb<
  BN extends string,
  T extends BaseValueName,
  O extends BaseVarbOptions = {}
> = Merge<DefaultBaseVarb<BN, T>, O>;

export const baseVarb = {
  default<BN extends string, T extends BaseValueName>(
    baseName: BN,
    valueName: T
  ): DefaultBaseVarb<BN, T> {
    return {
      valueName,
      baseName,
      switchName: null,
      selectable: true,
    };
  },
  type<
    BN extends string,
    T extends BaseValueName,
    O extends BaseVarbOptions = {}
  >(baseName: BN, valueName: T, options?: O): BaseVarb<BN, T, O> {
    return Obj.merge(this.default(baseName, valueName), options ?? ({} as O)) as BaseVarb<BN, T, O>;
  },

  numObj<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ): BaseVarb<BN, "numObj", O> {
    return this.type(baseName, "numObj", options);
  },
  string<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ): BaseVarb<BN, "string", O> {
    return this.type(baseName, "string", options);
  },

  stringArray<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ): BaseVarb<BN, "stringArray", O> {
    return this.type(baseName, "stringArray", options);
  },
  number<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ): BaseVarb<BN, "number", O> {
    return this.type(baseName, "number", options);
  },
  boolean<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ): BaseVarb<BN, "boolean", O> {
    return this.type(baseName, "boolean", options);
  },
};
