import { StateValue } from "./StateValue";
import { ValueName } from "./ValueName";

export type ValueMeta<VN extends ValueName> = {
  is: (value: any) => value is StateValue<VN>;
  initDefault: () => StateValue<VN>;
  zod: any;
  mon: any;
};

type ValueMetasGeneric = {
  [VN in ValueName]: ValueMeta<VN>;
};

export function checkValueMetas<VM extends ValueMetasGeneric>(vm: VM) {
  return vm;
}
