import { UpdateInfoArr } from "./relVarb/UpdateInfoArr";
import {
  BaseValueName,
  BaseValues,
  baseValues,
  BaseValueTypes,
} from "../baseSections/baseValues";
import { relVarbInfo } from "./relVarbInfo";
import { UpdateByGatherName } from "./relValues/numObjUpdateInfos/calculationUpdates";
import { relProps } from "./relMisc";
import { BaseVarbInfo } from "../baseVarbInfo";
import { RelValues, relValues } from "./relValues";
import { Merge } from "../../../../utils/Obj/merge";
import { Obj } from "../../../../utils/Obj";
import { NumObj } from "../baseSections/baseValues/NumObj";
import { BaseName, VarbName } from "../BaseName";
import { BaseNameSelector } from "../baseNameArrs";

export type DisplayName = string | BaseVarbInfo<"relFocal">;
export type GeneralRelVarb<
  T extends BaseValueName = BaseValueName,
  O = {
    valueName: T;
    initValue: BaseValueTypes[T];
    updateInfoArr: UpdateInfoArr<T>;

    displayName: DisplayName;
    endDisplayName: string;
    startDisplayName: string;

    startAdornment: string;
    endAdornment: string;
  }
> = T extends "numObj" ? O & { roundTo: number } : O;

export type RelVarbOptions<T extends BaseValueName> = Partial<
  Omit<GeneralRelVarb<T>, "valueName" | "displayName">
>;

export type RelVarbProps<BN extends BaseValueName> = RelVarbOptions<BN> & {
  displayName: DisplayName;
};

export type LeftRightVarbInfos = [
  BaseVarbInfo<"relInVarb">,
  BaseVarbInfo<"relInVarb">
];

type DefaultRelVarb<T extends BaseValueName, D extends DisplayName> = {
  valueName: T;
  displayName: D;
  initValue: ReturnType<BaseValues[T]["defaultInit"]>;
  startAdornment: "";
  endAdornment: "";
  updateInfoArr: readonly [
    {
      updateName: RelValues[T]["defaultUpdateName"];
      updateProps: {};
    }
  ];
} & (T extends "numObj" ? { roundTo: typeof NumObj.roundTo.cents } : {});

const relVarbOptions = {
  money: {
    startAdornment: "$",
    roundTo: NumObj.roundTo.cents,
  },
  percent: {
    startAdornment: "%",
    roundTo: NumObj.roundTo.percent,
  },
  get moneyMonth() {
    return {
      ...this.money,
      endAdornment: "/month",
    };
  },
  get moneyYear() {
    return {
      ...this.money,
      endAdornment: "/year",
    };
  },
} as const;

export type RelVarb<
  T extends BaseValueName,
  D extends DisplayName,
  O extends RelVarbOptions<T> = {}
> = Merge<DefaultRelVarb<T, D>, O>;

export const relVarb = {
  default<T extends BaseValueName, D extends DisplayName>(
    valueName: T,
    displayName: D
  ): DefaultRelVarb<T, D> {
    return {
      valueName,
      displayName,
      startDisplayName: "",
      endDisplayName: "",

      initValue: baseValues[valueName].defaultInit(),
      startAdornment: "", // value adornments: $100, 10%
      endAdornment: "", // as opposed to displayName adornments: Taxes (monthly)
      updateInfoArr: [
        {
          updateName: relValues[valueName].defaultUpdateName,
          updateProps: {},
        },
      ] as const,
      ...(valueName === "numObj" ? { roundTo: NumObj.roundTo.cents } : {}),
    } as DefaultRelVarb<T, D>;
  },
  type<
    T extends BaseValueName,
    D extends DisplayName,
    O extends RelVarbOptions<T> = {}
  >(valueName: T, displayName: D, options?: O): RelVarb<T, D, O> {
    return Obj.merge(
      this.default(valueName, displayName),
      options ?? ({} as O)
    );
  },
  string<D extends DisplayName, O extends RelVarbOptions<"string">>(
    displayName: D,
    options?: O
  ) {
    return this.type("string", displayName, options);
  },
  numObj<D extends DisplayName, O extends RelVarbOptions<"numObj"> = {}>(
    displayName: D,
    options?: O
  ): RelVarb<"numObj", D, O> {
    return this.type("numObj", displayName, options);
  },
  entityEditor<
    D extends DisplayName,
    O extends Omit<RelVarbOptions<"numObj">, "updateInfoArr"> = {}
  >(displayName: D, options?: O) {
    return this.numObj(
      displayName,
      Obj.merge(options ?? ({} as O), {
        updateInfoArr: [
          {
            updateName: "entityEditor",
            updateProps: {},
          },
        ],
      } as const)
    );
  },
  moneyObj<D extends DisplayName, O extends RelVarbOptions<"numObj"> = {}>(
    displayName: D,
    options?: O
  ) {
    return this.numObj(displayName, {
      ...relVarbOptions.money,
      ...options,
    } as const);
  },
  moneyMonth<D extends DisplayName, O extends RelVarbOptions<"numObj"> = {}>(
    displayName: D,
    options?: O
  ) {
    return this.moneyObj(displayName, {
      endAdornment: "/month",
      ...options,
    } as const);
  },
  moneyYear<D extends DisplayName, O extends RelVarbOptions<"numObj"> = {}>(
    displayName: D,
    options?: O
  ) {
    return this.moneyObj(displayName, {
      ...options,
      endAdornment: "/year",
    } as const);
  },
  percentObj<D extends DisplayName, O extends RelVarbOptions<"numObj"> = {}>(
    displayName: D,
    options?: O
  ) {
    return this.numObj(displayName, {
      endAdornment: "%",
      roundTo: 3,
      ...options,
    } as const);
  },
  sumNums<
    D extends DisplayName,
    I extends BaseVarbInfo<"relInVarb">,
    O extends RelVarbOptions<"numObj"> = {}
  >(displayName: D, nums: readonly I[], options?: O) {
    return this.numObj(displayName, {
      valueName: "numObj",
      updateInfoArr: [
        {
          updateName: "sumNums",
          updateProps: { nums },
        },
      ],
      ...options,
    } as const);
  },
  sumMoney<
    D extends DisplayName,
    I extends BaseVarbInfo<"relInVarb">,
    O extends RelVarbOptions<"numObj"> = {}
  >(displayName: D, nums: readonly I[], options?: O) {
    return this.sumNums(displayName, nums, {
      ...relVarbOptions.money,
      ...options,
    } as const);
  },
  sumChildVarb<
    D extends DisplayName,
    SN extends BaseName,
    V extends VarbName<SN, "numObj">,
    O extends RelVarbOptions<"numObj"> = {},
    Options = { sectionName: SN; varbName: V }
  >(displayName: D, sectionName: SN, varbName: V, options?: O) {
    return this.sumNums(
      displayName,
      [
        {
          context: "fe",
          sectionName,
          varbName,
          idType: "relId",
          id: "children",
        } as BaseVarbInfo<"relChildren", Options>,
      ] as const,
      options
    );
  },
  sumLocalMoney<
    D extends DisplayName,
    SN extends BaseName,
    VNS extends VarbName<SN, "numObj">[],
    O extends RelVarbOptions<"numObj"> = {}
  >(displayName: D, sectionName: SN, localVarbNames: VNS, options?: O) {
    const varbsToSum = relVarbInfo.localsByVarbName(
      sectionName,
      localVarbNames as VNS & VarbName<SN & BaseNameSelector>[]
    );
    return this.sumMoney(displayName, varbsToSum, options);
  },
  percentToPortion<
    D extends DisplayName,
    U extends {
      base: BaseVarbInfo<"relInVarb">;
      percentOfBase: BaseVarbInfo<"relInVarb">;
    },
    O extends RelVarbOptions<"numObj"> = {}
  >(displayName: D, updateProps: U, options?: O) {
    return this.numObj(displayName, {
      updateInfoArr: [
        {
          updateName: "percentToPortion",
          updateProps,
        },
      ],
      ...options,
    });
  },
  numUpdate<
    D extends DisplayName,
    UN extends UpdateByGatherName<"num">,
    N extends BaseVarbInfo<"relInVarb">,
    O extends RelVarbOptions<"numObj"> = {}
  >(displayName: D, updateName: UN, num: N, options?: O) {
    return this.numObj(displayName, {
      updateInfoArr: [
        {
          updateName,
          updateProps: { num },
        },
      ],
      ...options,
    });
  },
  leftRightUpdate<
    D extends DisplayName,
    UN extends UpdateByGatherName<"leftRight">,
    P extends [
      left: BaseVarbInfo<"relInVarb">,
      right: BaseVarbInfo<"relInVarb">
    ]
  >(
    displayName: D,
    updateName: UN,
    leftRight: P,
    options?: RelVarbOptions<"numObj">
  ) {
    return this.numObj(displayName, {
      updateInfoArr: [
        {
          updateName,
          updateProps: leftRight,
        },
      ] as const,
      ...options,
    });
  },
  stringOrLoaded<
    S extends BaseName<"hasVarb">,
    D extends DisplayName,
    O extends RelVarbOptions<"string"> = {}
  >(sectionName: S, displayName: D, options?: O) {
    return {
      ...this.string(displayName, {
        ...(options || ({} as O)),
        updateInfoArr: [
          {
            switchInfo: {
              sectionName,
              varbName: "valueSwitch",
              id: "local",
              idType: "relative",
            },
            switchValue: "loadedVarb",
            updateName: "loadedDisplayName",
            updateProps: relProps.loadedVarb(sectionName),
          },
          {
            updateName: relValues.string.defaultUpdateName,
            updateProps: {},
          },
        ],
      } as const),
    };
  },
};

function _relVarbTypeTest() {
  const _typeTest = relVarb.type("numObj", "Test Name");
  const _type: {
    valueName: "numObj";
    initValue: NumObj;
    displayName: "Test Name";
    startAdornment: "";
    endAdornment: "";
    updateInfoArr: readonly [{ updateName: "entityEditor"; updateProps: {} }];
    roundTo: 2;
  } = _typeTest;
}
