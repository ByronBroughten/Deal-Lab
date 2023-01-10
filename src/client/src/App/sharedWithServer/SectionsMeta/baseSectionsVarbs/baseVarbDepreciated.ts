import { Obj } from "../../utils/Obj";
import { Merge } from "../../utils/Obj/merge";
import { SwitchName } from "./baseSwitchNames";

export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityInfo",
] as const;
export type ValueName = typeof valueNames[number];

export const baseVarb = {
  default<BN extends string, T extends ValueName>(
    baseName: BN,
    valueName: T
  ): DefaultBaseVarb<BN, T> {
    return {
      baseName,
      valueName,
      selectable: true,
      switchName: null,
    };
  },
  make<BN extends string, T extends ValueName, O extends BaseVarbOptions = {}>(
    baseName: BN,
    valueName: T,
    options?: O
  ): BaseVarbDepreciated<BN, T> {
    return Obj.merge(this.default(baseName, valueName), options ?? {});
  },
};

export type BaseVarbDepreciated<
  BN extends string,
  T extends ValueName,
  O extends BaseVarbOptions = {}
> = Merge<DefaultBaseVarb<BN, T>, O>;

export type BaseVarbOptions = Partial<Omit<GeneralBaseVarb, "valueName">>;

type DefaultBaseVarb<BN extends string, T extends ValueName> = {
  baseName: BN; // baseName, useful for varbs with name appensions
  valueName: T;

  selectable: true;
  switchName: null;
};

export type GeneralBaseVarb<
  BN extends string = string,
  T extends ValueName = ValueName
> = {
  baseName: BN;
  valueName: T;

  switchName: SwitchName | null;
  selectable: boolean;
};
