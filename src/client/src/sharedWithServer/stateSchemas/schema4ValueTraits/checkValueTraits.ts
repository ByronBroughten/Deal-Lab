import { ValueName } from "../schema1ValueNames";
import { StateValue } from "./StateValue";

export type ValueTraits<VN extends ValueName> = {
  initDefault: () => StateValue<VN>;
  validate: (value: any) => StateValue<VN>;
  is: (value: any) => value is StateValue<VN>;
};

type ValueMetasGeneric = {
  [VN in ValueName]: ValueTraits<VN>;
};

export function checkValueTraits<VM extends ValueMetasGeneric>(vm: VM) {
  return vm;
}
