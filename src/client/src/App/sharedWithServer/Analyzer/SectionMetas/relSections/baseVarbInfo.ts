import { MergeUnionObjNonNullable } from "../../../utils/types/MergeUnionObj";
import { BaseInfoSets, InfoIdName, InfoIds } from "./baseInfo";
import { BaseValueName } from "./baseSections/baseValues";
import { BaseName, VarbName, VarbNameWide } from "./BaseName";
import { SectionContext } from "./baseSections";
import { BaseNameSelector, FeBaseSectionVarbs } from "./baseNameArrs";
import { SwitchName } from "./baseSections/baseSwitch";
import { SubType } from "../../../utils/types";

// I want to use some of the logic of these for "VarbName"

// I can make it use "vnOngoing", etc.
// I'll do that for now.

// Get all the varbSectionNames

// I want VarbName to be able to give me OngoingVarbName
// And other varbNames, right?

type VarbSets = {
  [SC in SectionContext]: {
    // varbValue
    [Prop in BaseValueName]: {
      varbName: VarbNameWide<"all", Prop, SC>;
    };
  } & {
    // varbName
    [Prop in VarbNameWide<"all", BaseValueName, SC> as `vn${Capitalize<
      string & Prop
    >}`]: { varbName: Prop };
  } & {
    // [SW in SwitchName as `vn${Capitalize<SW & string>}`]: any
  } & {
    general: UnionVarbInfo;
    context: { context: SC };
  };
};

type VarbInfoSets = {
  [SC in SectionContext]: BaseInfoSets[SC] & VarbSets[SC];
};

export type BaseVarbSelector = keyof VarbInfoSets[SectionContext];
type FullSelector = keyof VarbInfoSets[SectionContext] | SectionContext;

type BaseVarbInfoCore<
  VS extends BaseVarbSelector,
  SC extends SectionContext
> = MergeUnionObjNonNullable<VarbInfoSets[SC][VS]>;

type BaseVarbInfoOptionsFull<
  VS extends BaseVarbSelector,
  SC extends SectionContext
> = UnionVarbInfo & BaseVarbInfoCore<VS, SC>;

export type BaseVIOptions<
  VS extends BaseVarbSelector,
  SC extends SectionContext = "fe"
> = Partial<BaseVarbInfoOptionsFull<VS, SC>>;

// all possible varbInfos in a union
type UnionVarbInfo<
  IN extends InfoIdName = InfoIdName,
  ID extends InfoIds[IN] = InfoIds[IN],
  SN extends BaseName<"all"> = BaseName<"all">,
  T extends BaseValueName = BaseValueName,
  C extends SectionContext = SectionContext
> = OneVarbInfos<T, IN, ID>[IN][C][SN];

type OneVarbInfo<
  IT extends InfoIdName = InfoIdName,
  ID extends InfoIds[IT] = InfoIds[IT],
  C extends SectionContext = "fe",
  SN extends BaseName<"all", C> = BaseName<"shared", C>,
  T extends BaseValueName = BaseValueName,
  VN extends VarbName<SN & BaseNameSelector, T, C> = VarbName<
    SN & BaseNameSelector,
    T,
    C
  >
> = {
  idType: IT;
  id: ID;
  context: C;
  sectionName: SN;
  varbName: VN;
};

type OneVarbInfos<
  VN extends BaseValueName,
  IN extends InfoIdName,
  ID extends InfoIds[IN]
> = {
  [I in IN]: {
    [C in SectionContext]: {
      [SN in BaseName<"hasVarb">]: OneVarbInfo<I, ID & InfoIds[I], C, SN, VN>;
    };
  };
};

export type GeneralBaseVarbInfo = BaseVarbInfo<"all", {}, SectionContext>;

export type BaseVarbInfo<
  FS extends FullSelector = "all" | "fe",
  O extends BaseVIOptions<VS & BaseVarbSelector, SC & SectionContext> = {},
  SCQ = Extract<FS, SectionContext>,
  SC = SCQ & SectionContext extends never ? "fe" : SCQ,
  VSQ = Extract<FS, keyof VarbInfoSets[SectionContext]>,
  VS = VSQ extends never ? "all" : VSQ
> = UnionVarbInfo &
  BaseVarbInfoCore<
    VS & keyof VarbInfoSets[SectionContext],
    SC & SectionContext
  > &
  O & { context: SC };

function _BaseVarbInfoTest(
  generalTest: BaseVarbInfo,
  specificTest: BaseVarbInfo<"string" | "analysis" | "relLocal">,
  optionsTest: BaseVarbInfo<
    "all",
    { sectionName: "property"; varbName: "title"; context: "fe" }
  >
) {
  const _testGeneral: {
    sectionName: BaseName<"all", "fe">;
    varbName: VarbNameWide<"all">;
    idType: InfoIdName;
    id: string;
    context: "fe";
  } = generalTest;

  const _testOptions: {
    sectionName: "analysis";
    varbName: "title";
    idType: "relId";
    id: "local";
    context: "fe";
  } = specificTest;

  const _testSpecific: {
    sectionName: "property";
    varbName: "title";
    idType: "feId" | "dbId" | "relId";
    id: string;
    context: "fe";
  } = optionsTest;

  if (generalTest.sectionName === "analysis") {
    const _testInfer: "title" = generalTest.varbName;
    // @ts-expect-error
    const _testInfer2: "price" = generalTest.varbName;
  }
}

export function baseVarbInfo<
  IN extends InfoIdName,
  SN extends BaseName<"all", SC>,
  VN extends VarbName<SN & BaseNameSelector, BaseValueName, SC>,
  ID extends InfoIds[IN],
  SC extends SectionContext = "fe"
>(idType: IN, sectionName: SN, varbName: VN, id: ID, context?: SC) {
  return {
    idType,
    sectionName,
    varbName,
    id,
    context: context ?? ("fe" as SC),
  } as OneVarbInfo<
    IN,
    ID,
    SC,
    SN & BaseName<"all">,
    BaseValueName,
    VN &
      VarbName<
        (SN & BaseName<"all">) & (SN & BaseNameSelector),
        BaseValueName,
        SC
      >
  >;
}

type _Test<SN extends BaseName, VN extends VarbName<SN>> = BaseVarbInfo<
  "all",
  { sectionName: SN; varbName: VN } & BaseVIOptions<"all", "fe">
>;

function _baseVarbInfoTest() {
  const info = baseVarbInfo("feId", "property", "title", "stringId");
  info.varbName;
  const _test: {
    idType: "feId";
    sectionName: "property";
    varbName: "title";
    id: "stringId";
    context: "fe";
  } = info;

  //@ts-expect-error
  const _fail0: "price" = info.varbName;
  //@ts-expect-error
  const _fail: "loan" = info.sectionName;
  //@ts-expect-error
  const _fail2: "db" = info.context;
}
