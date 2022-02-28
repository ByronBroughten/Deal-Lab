import { MergeUnionObjNonNullable } from "../../../utils/types/MergeUnionObj";
import { BaseName } from "./BaseName";
import { BaseSections, SectionContext } from "./baseSections";
import { BaseValueTypes } from "./baseSections/baseValues";
import { BaseVarbInfo, GeneralBaseVarbInfo } from "./baseVarbInfo";

type SectionVarbSchemas<
  C extends SectionContext,
  SN extends BaseName<"all", C>,
  BaseContext = BaseSections[C],
  BaseSection = BaseContext[SN & keyof BaseContext],
  Schemas = BaseSection["varbSchemas" & keyof BaseSection]
> = MergeUnionObjNonNullable<Schemas & object>;

type VarbSchema<
  I extends GeneralBaseVarbInfo,
  C = I["context"] & SectionContext,
  VS = SectionVarbSchemas<
    C & SectionContext,
    I["sectionName"] & BaseName<"all", C & SectionContext>
  >
> = VS[I["varbName"] & keyof VS];

export type BaseInfoValueName<
  I extends GeneralBaseVarbInfo,
  VS = VarbSchema<I>
> = VS["valueName" & keyof VS];

export type BaseInfoValue<I extends GeneralBaseVarbInfo> =
  BaseValueTypes[BaseInfoValueName<I> & keyof BaseValueTypes];

function _testInfoValueNameType(
  numObjName: BaseInfoValueName<
    BaseVarbInfo<"property" | "propertyGeneral", { varbName: "price" }>
  >,
  stringName: BaseInfoValueName<BaseVarbInfo<"string">>
) {
  const _numObj: "numObj" = numObjName;
  const _string: "string" = stringName;
  //@ts-expect-error
  const _fail: "string" = numObjName;

  const _string2: BaseInfoValue<BaseVarbInfo<"string">> = "This is type string";
  //@ts-expect-error
  const _string3: BaseInfoValue<BaseVarbInfo<"string">> = 5;
}
