import { StateValue } from "../StateValue";
import { ValueName } from "../ValueName";

export type ValueMeta<VN extends ValueName> = {
  initDefault: () => StateValue<VN>;
  validate: (value: any) => StateValue<VN>;
  is: (value: any) => value is StateValue<VN>;
  zod: any;
};

type ValueMetasGeneric = {
  [VN in ValueName]: ValueMeta<VN>;
};

export function checkValueMetas<VM extends ValueMetasGeneric>(vm: VM) {
  return vm;
}
