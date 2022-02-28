import { Obj } from "../../../../utils/Obj";
import { MergeUnionObjNonNullable } from "../../../../utils/types/MergeUnionObj";
import { BaseValueName } from "../baseSections/baseValues";
import { BaseVarbInfo } from "../baseVarbInfo";
import { RelValues } from "./relValues";
import { AllGatherProps } from "./relValues/gatherProps";
import { RelSpecifiedPropSchemas } from "./relValues/updateProps";

// UpdateName
type UpdateNameNarrow<T extends BaseValueName = BaseValueName> =
  keyof RelValues[T]["updateInfos"];
type UpdateNameWide<T extends BaseValueName = BaseValueName> =
  keyof MergeUnionObjNonNullable<RelValues[T]["updateInfos"]>;
export type UpdateName<
  T extends BaseValueName = BaseValueName,
  S extends "narrow" | "wide" = "narrow"
> = S extends "narrow" ? UpdateNameNarrow<T> : UpdateNameWide<T>;

function _(narrow: UpdateName, wide: UpdateName<BaseValueName, "wide">) {
  const _: "direct" = narrow;
  const __: typeof wide = "editorValue";
  const ___: typeof wide = "sumNums";
}

// UpdateProps
export type UpdateProps<
  T extends BaseValueName,
  U extends UpdateName<T>,
  UpdateInfo = RelValues[T]["updateInfos"][U],
  GatherName = UpdateInfo["gatherName" & keyof UpdateInfo],
  RelPropNameToTypeNameArr = AllGatherProps[GatherName &
    keyof AllGatherProps]["relSpecified"],
  RelPropNameToTypeName = {
    [Prop in keyof RelPropNameToTypeNameArr]: RelPropNameToTypeNameArr[Prop][number &
      keyof RelPropNameToTypeNameArr[Prop]];
  },
  RelPropNameToSourceName = {
    [Prop in keyof RelPropNameToTypeName]: RelSpecifiedPropSchemas[RelPropNameToTypeName[Prop] &
      keyof RelSpecifiedPropSchemas]["sources"][number];
  }
> = {
  [Prop in keyof RelPropNameToSourceName]: BaseVarbInfo<
    BaseValueName & RelPropNameToSourceName[Prop]
  >;
};
