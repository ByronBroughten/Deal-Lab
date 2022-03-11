import { BaseValue } from "../../baseSections/baseValues";
import { NumObj, NumObjNumber } from "../../baseSections/baseValues/NumObj";
import { GatherName, GatherProps } from "./gatherProps";

export type GeneralUpdateInfos<V extends BaseValue> = {
  [updateName: string]: UpdateInfo<
    GatherName,
    (props: GatherProps<GatherName>) => V
  >;
};

export type UpdateInfo<
  G extends GatherName = GatherName,
  F extends (props: GatherProps<G>) => BaseValue = (
    props: GatherProps<G>
  ) => BaseValue
> = {
  gatherName: G;
  updateFn: F;
};
export function updateInfo<
  G extends GatherName,
  F extends (props: GatherProps<G>) => BaseValue
>(gatherName: G, updateFn: F): UpdateInfo<G, F> {
  return {
    gatherName,
    updateFn,
  };
}
const testUpdateInfo = (
  info: UpdateInfo<"nums", (props: { nums: NumObjNumber[] }) => NumObj>
) => {
  const test: "nums" = info.gatherName;
};
