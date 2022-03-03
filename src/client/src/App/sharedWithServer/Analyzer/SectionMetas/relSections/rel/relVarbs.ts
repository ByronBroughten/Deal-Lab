import { ObjectEntries, Obj } from "../../../../utils/Obj";
import { SectionContext } from "../baseSections";
import { BaseValueName } from "../baseSections/baseValues";
import {
  DisplayName,
  GeneralRelVarb,
  RelVarb,
  relVarb,
  RelVarbOptions,
} from "./relVarb";
import { switchVarbNames } from "../baseSections/baseSwitch";
import { relVarbsSwitch } from "./relVarbs/relVarbsSwitch";
import { relVarbInfo } from "./relVarbInfo";
import {
  monthsYearsInput,
  ongoingInput,
  ongoingSumNums,
  ongoingPercentToPortion,
  MonthlyYearlySwitchOptions,
} from "./relVarbs/relVarbsOngoing";
import { relProps } from "./relMisc";
import { BaseName, VarbName, VarbValueName } from "../BaseName";
import { BaseNameSelector } from "../baseNameArrs";
import { BaseVarbSelector } from "../baseVarbInfo";
import { omit } from "lodash";

export type GeneralRelVarbs<
  SN extends BaseName<"all", SC>,
  TN extends BaseValueName = BaseValueName,
  SC extends SectionContext = "fe",
  VN = VarbName<SN & BaseNameSelector, TN, SC>
> = {
  [Prop in VN & string]: GeneralRelVarb<
    VarbValueName<
      SN & BaseVarbSelector,
      Prop & VarbName<SN & BaseNameSelector, TN, SC>
    > &
      BaseValueName
  >;
};

const _GeneralRelVarbsTest = (_propertyTest: GeneralRelVarbs<"property">) => {
  const _title: GeneralRelVarb<"string"> = _propertyTest.title;
  const _titleValueName: "string" = _title.valueName;
  // @ts-expect-error
  const _titleFail: "numObj" = _title.valueName;
};

function isRelVarbOfValue<VN extends BaseValueName>(
  valueName: VN,
  value: any
): value is GeneralRelVarb<VN & BaseValueName> {
  return value.valueName === valueName;
}

type Two<SN extends BaseName<"all">, VN extends BaseValueName> = readonly [
  VarbName<SN, VN>,
  DisplayName
];
type Three<SN extends BaseName<"all">, VN extends BaseValueName> = readonly [
  ...Two<SN, VN>,
  RelVarbOptions<VN>
];
type PropArr<SN extends BaseName<"all">, VN extends BaseValueName> = readonly (
  | Two<SN, VN>
  | Three<SN, VN>
)[];

export type RelVarbsOfType<
  SN extends BaseName<"all">,
  VN extends BaseValueName,
  PA extends PropArr<SN, VN>
> = {
  [Props in PA[number] as Props[0]]: RelVarb<
    VN,
    Props[1],
    Props extends [any, any, any] ? Props[2] : {}
  >;
};

export const relVarbs = {
  type<
    SN extends BaseName<"all">,
    VN extends BaseValueName,
    PA extends PropArr<SN, VN>,
    Result = RelVarbsOfType<SN, VN, PA>
  >(_sectionName: SN, valueName: VN, propArr: PA): Result {
    return propArr.reduce((relVarbs, props) => {
      relVarbs[props[0] as any as keyof Result] = relVarb.type(
        valueName,
        props[1],
        props[2] ?? {}
      ) as any as Result[keyof Result];
      return relVarbs;
    }, {} as Result);
  },
  strings<SN extends BaseName, PA extends PropArr<SN, "string">>(
    _sectionName: SN,
    propArr: PA
  ): RelVarbsOfType<SN, "string", PA> {
    return this.type(_sectionName, "string", propArr);
  },
  ...relVarbsSwitch,

  // same as ongoing, but instead of an entityEditor
  // use PercentToPortion
  ongoingPercentToPortion,
  monthsYearsInput,

  timeMoney(
    varbNameBase: string,
    displayName: DisplayName,
    sectionName: BaseName<"hasVarb">,
    options: MonthlyYearlySwitchOptions = {}
  ) {
    relVarbsSwitch.

    return this.ongoingInput(varbNameBase, displayName, sectionName, {
      ...options,
      shared: { ...options.shared, startAdornment: "$" },
    });
  },
  filterByValueName<
    SN extends BaseName<"all">,
    RV extends GeneralRelVarbs<SN>,
    VN extends BaseValueName,
    Skip extends readonly (keyof RV)[] = [],
    SVN = keyof GeneralRelVarbs<SN, VN>,
    Result = Pick<RV, SVN & keyof RV>
  >(
    _sectionName: SN,
    valueName: VN,
    relVarbs: RV,
    skip?: Skip
  ): Omit<Result, Skip[number]> {
    const partial: Partial<Result> = {};
    for (const [varbName, relVarb] of ObjectEntries(relVarbs)) {
      if (isRelVarbOfValue(valueName, relVarb))
        partial[varbName as any as keyof Result] =
          relVarb as any as Result[keyof Result];
    }
    return omit(partial as any, (skip ?? []) as Skip) as Omit<
      Result,
      Skip[number]
    >;
  },
  sectionStrings<
    SN extends BaseName,
    PV extends GeneralRelVarbs<SN>,
    ToSkip extends readonly (keyof PV)[] = []
  >(_sectionName: SN, relVarbs: PV, toSkip?: ToSkip) {
    return this.filterByValueName(_sectionName, "string", relVarbs, toSkip);
  },
  varbInfo<SN extends BaseName>(sectionName: SN) {
    return this.strings(
      // typescript wants to make sure that the right sectionName
      // is being provided, i.e., a sectionName that contains these varbs.
      // I guess I can make a sectionName of that nature.
      sectionName,
      [
        ["sectionName", "Section Name"],
        ["varbName", "Variable Name"],
        ["id", "ID"],
        ["idType", "ID Type"],
      ] as const
    );
  },
  entityInfo<SN extends BaseName>(sectionName: SN) {
    return {
      ...this.varbInfo(sectionName),
      entityId: relVarb.string("Entity ID"),
    };
  },
  singleTimeItem<S extends "singleTimeItem">() {
    const sectionName = "singleTimeItem";
    const valueSwitchProp = relVarbInfo.local(sectionName, "valueSwitch");
    const r = {
      name: relVarb.stringOrLoaded(sectionName, "Name"),
      valueSwitch: relVarb.string("ValueSwitch", {
        initValue: "labeledEquation",
      }),
      ...relVarbs.entityInfo(sectionName),
      editorValue: relVarb.entityEditor("Editor Value", {
        startAdornment: "$",
      }),
      value: relVarb.numObj(relVarbInfo.local(sectionName, "name"), {
        updateFnName: "editorValue",
        updateFnProps: {
          proxyValue: relVarbInfo.local(sectionName, "editorValue"),
          valueSwitch: valueSwitchProp,
        },
        inUpdateProps: [
          {
            switchInfo: {
              sectionName,
              varbName: "valueSwitch",
              id: "local",
              idType: "relative",
            },
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              ...relProps.loadedVarb(sectionName),
              valueSwitch: valueSwitchProp,
            },
          },
        ],
        startAdornment: "$",
      }),
    };
    return r;
  },
  ongoingItem<S extends "ongoingItem">() {
    const sectionName = "ongoingItem";
    const ongoingValueNames = switchVarbNames("value", "ongoing");

    const defaultValueUpdatePack = {
      updateFnName: "editorValue",
      updateFnProps: relProps.locals("ongoingItem", [
        "editorValue",
        "valueSwitch",
      ]),
    } as const;
    const ongoingSwitchInfo = relVarbInfo.local(
      sectionName,
      ongoingValueNames.switch
    );
    const valueSwitchProp = relVarbInfo.local(sectionName, "valueSwitch");
    return {
      name: relVarb.stringOrLoaded(sectionName),
      valueSwitch: relVarb.string({ initValue: "labeledEquation" }),

      ...relVarbs.entityInfo(),
      costToReplace: relVarb.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),

      editorValue: relVarb.calcVarb("", {
        startAdornment: "$",
        endAdornment: "/month",
      }),
      // ...relVarbs.ongoingInput("editorValue", "Item Value", sectionName),

      // Options
      // 1. Two editorValues
      // - When one is selected, the other just coppies its value
      // - OngoingValues just takes the value from one of them, as
      //   they're doing now.
      // - The same switch that controls which ongoingValue to use
      //   is also used to control which of the two editors to use
      //   But the editors are changed out just to show the right adornment

      // 2. One editorValue
      // - Keep things as they are, but hardcode a switch
      //   in AdditiveItem.

      // Before deciding, implement a regular switch of such nature
      // with taxes and home insurance

      ...relVarbs.monthsYearsInput(
        "lifespan",
        "Average lifespan",
        sectionName,
        { switchInit: "years" }
      ),
      [ongoingValueNames.switch]: relVarb.string({
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: relVarb.moneyMonth("Monthly amount", {
        ...defaultValueUpdatePack,
        inUpdateProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "yearly",
            updateFnName: "yearlyToMonthly",
            updateFnProps: {
              num: relVarbInfo.local(sectionName, ongoingValueNames.yearly),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfo.local(sectionName, "costToReplace"),
              rightSide: relVarbInfo.local(sectionName, "lifespanMonths"),
            },
          },
        ],
      }),
      [ongoingValueNames.yearly]: relVarb.moneyYear("Annual amount", {
        ...defaultValueUpdatePack,
        inUpdateProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "monthly",
            updateFnName: "monthlyToYearly",
            updateFnProps: {
              num: relVarbInfo.local(sectionName, ongoingValueNames.monthly),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfo.local(sectionName, "costToReplace"),
              rightSide: relVarbInfo.local(sectionName, "lifespanYears"),
            },
          },
        ],
      }),
    };
  },
  singleTimeList<SN extends BaseName<"singleTimeList">>(sectionName: SN) {
    return {
      total: relVarb.sumNums(
        relVarbInfo.local(sectionName, "title"),
        [relVarbInfo.relative("singleTimeItem", "value", "children")],
        { startAdornment: "$" }
      ),
      title: relVarb.string(),
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
      }),
    };
  },
  ongoingList<SN extends BaseName<"ongoingList">>(sectionName: SN) {
    return {
      title: relVarb.string(),
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
      }),
      ...relVarbs.ongoingSumNums(
        "total",
        relVarbInfo.local(sectionName, "title"),
        [relVarbInfo.relative("ongoingItem", "value", "children")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    };
  },
};

function _relVarbsTypeTest() {
  const result = relVarbs.type("property", "string", [
    ["title", "Title"],
  ] as const);
  const _testTitle: GeneralRelVarb<"string"> = result.title;
  // @ts-expect-error
  const _testPrice: GeneralRelVarb<"string"> = result.price;
}

function _testFilterByValueName(rv: GeneralRelVarbs<"property">) {
  const numObjTest = relVarbs.filterByValueName("property", "numObj", rv);
  numObjTest.price.valueName;

  const test = relVarbs.filterByValueName("property", "string", rv, [
    "title",
  ] as const);
  const _taxesTest: GeneralRelVarb<"string"> = test.taxesOngoingSwitch;
  // @ts-expect-error
  const _titleTest: GeneralRelVarb<"string"> = test.title;
  // @ts-expect-error
  const _priceTest: any = test.price;
}
