import { SwitchName, SwitchTargetKey, SwitchVarbName } from "./baseSwitchNames";
import { BaseVarb } from "./baseVarb";

export type BaseTargetVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "numObj",
  { switchName: SW }
>;
type BaseSwitchVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "string",
  {
    switchName: SW;
    selectable: false;
  }
>;
export type BaseSwitchTargetVarbs<BN extends string, SW extends SwitchName> = {
  [Prop in SwitchTargetKey<SW> as SwitchVarbName<BN, SW, Prop>]: BaseTargetVarb<
    BN,
    SW
  >;
};

export type BaseSwitchVarbs<
  BN extends string,
  SW extends SwitchName
> = BaseSwitchTargetVarbs<BN, SW> & {
  [Prop in "switch" as SwitchVarbName<BN, SW, Prop>]: BaseSwitchVarb<BN, SW>;
};