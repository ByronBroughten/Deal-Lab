import { RelVarb, relVarb, RelVarbOptions, RelVarbProps } from "../relVarb";
import {
  SwitchName,
  SwitchTargetKey,
  SwitchKey,
} from "../../baseSections/baseSwitch";
import {
  SwitchBase,
  SwitchVarbName,
  relSwitch,
  RelSwitchDefaults,
} from "./../relSwitch";
import { Merge } from "../../../../../utils/Obj/merge";
import { Obj } from "../../../../../utils/Obj";
import { BaseName, VarbName } from "../../BaseName";
import { BaseVarbInfo } from "../../baseVarbInfo";
import { relVarbInfo } from "./../relVarbInfo";
import { Relative } from "../relVarbInfoTypes";
import { RelUpdateSwitchStuff } from "../relVarb/UpdateInfoArr";

type TargetProps<SW extends SwitchName> = {
  [Prop in SwitchTargetKey<SW>]: RelVarbProps<"numObj">;
};

type RelSwitchProps<SW extends SwitchName = SwitchName> = {
  [SK in SwitchKey<SW>]: SK extends "switch"
    ? RelVarbProps<"string">
    : RelVarbProps<"numObj">;
} & {
  targets?: RelVarbOptions<"numObj">;
};

// type RelSwitchProps<SW extends SwitchName = SwitchName> = TargetProps<SW> & {
//   switch: RelVarbProps<"string">;
// } & {
//   targets?: RelVarbOptions<"numObj">;
// };

type RelSwitchTargets<
  SW extends SwitchName,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>,
  TP extends TargetProps<SW>,
  TO extends RelVarbOptions<"numObj"> = {}
> = {
  [SK in SwitchTargetKey<SW> as SwitchVarbName<SW, SK, SN, SB>]: RelVarb<
    "numObj",
    TP[SK]["displayName"],
    Merge<TO, TP[SK]>
  >;
};

type RelSwitchVarbs<
  SW extends SwitchName,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>,
  SP extends RelSwitchProps<SW>
> = RelSwitchTargets<SW, SN, SB, SP, SP["targets"]> & {
  [SK in "switch" as SwitchVarbName<SW, SK, SN, SB>]: RelVarb<
    "string",
    SP["switch"]["displayName"],
    SP["switch"]
  >;
};

type RelSwitchPropsAndDefaults<
  SW extends SwitchName,
  PR extends RelSwitchProps<SW>
> = {
  targets?: PR["targets"];
} & {
  [SK in SwitchKey<SW>]: Merge<
    RelSwitchDefaults[SW][SK & keyof RelSwitchDefaults[SW]],
    PR[SK & keyof PR]
  >;
};

const updateFnPrecursorFns = {
  sumNums<V extends VarbName, P extends UpdateFnPrecursors>(props: P) {},
};

// they each need theire own name in it, too, right?
type UpdateFnPrecursorCores = {
  sumNums: Pick<BaseVarbInfo<"relId">, "sectionName" | "id">;
};

type UpdateFnPrecursors = {
  [Prop in keyof UpdateFnPrecursorCores]: {
    precursorName: Prop;
  } & UpdateFnPrecursorCores[Prop];
};
type UpdateFnPrecursorName = keyof UpdateFnPrecursorCores;
type UpdateFnPrecursorPlusSwitch = {
  [Prop in keyof UpdateFnPrecursorCores]: UpdateFnPrecursorCores[Prop] &
    RelUpdateSwitchStuff;
};
type UpdateFnPrecursorArr = [
  ...UpdateFnPrecursorPlusSwitch[UpdateFnPrecursorName][],
  UpdateFnPrecursors[UpdateFnPrecursorName]
];

export const relVarbsSwitch = {
  general<
    SW extends SwitchName,
    SN extends BaseName<SW>,
    SB extends SwitchBase<SW, SN>,
    SP extends RelSwitchProps<SW>
  >(switchName: SW, sectionName: SN, baseName: SB, props: SP) {
    const names = relSwitch.varbNames(switchName, sectionName, baseName);
    const targetRelVarbs = relSwitch
      .targetKeyArr(switchName)
      .reduce((tRelVarbs, tName) => {
        const param = props[tName];
        tRelVarbs[names[tName as keyof typeof names]] = relVarb.numObj(
          param.displayName,
          {
            ...param,
            ...props.targets,
          }
        );
      }, {} as any);

    return {
      ...targetRelVarbs,
      [names.switch]: relVarb.string(props.switch.displayName, props.switch),
    } as RelSwitchVarbs<SW, SN, SB, SP>;
  },
  plusDefaultProps<
    SW extends SwitchName,
    SN extends BaseName<SW>,
    SB extends SwitchBase<SW, SN>,
    SP extends RelSwitchProps<SW>
  >(
    switchName: SW,
    _sectionName: SN,
    _switchBase: SB,
    props: SP
  ): RelSwitchVarbs<SW, SN, SB, SP> {
    return relSwitch.keyArr(switchName).reduce((nextProps, switchKey) => {
      const def = relSwitch.default(switchName, switchKey);
      return Obj.update(
        nextProps,
        switchKey,
        Obj.merge(def as any, props[switchKey])
      );
    }, {} as any);
  },
  // plusUpdatePropArr<
  //   SW extends SwitchName,
  //   SP extends RelSwitchProps<SW>
  // >()
  // {},
  plusPropArr() {
    // will I need the varbName for each propArr?
    // not necessarily
    // for sumNums, I will need the varbName ending.
  },
  plusSumNumPropArr<
    SW extends SwitchName,
    SP extends RelSwitchProps<SW>,
    PC extends {
      id: Relative;
    }
  >(switchName: Sw, props: SP): void {
    for (const switchKey of relSwitch.targetKeyArr(switchName)) {
    }
    // type TargetKey = SwitchTargetKey<SW>;
    // type ToReturn = {
    //   [Prop in TargetKey]: Merge<
    //     SP[Prop],
    //     {
    //       updateFn: "sumNums";
    //       updateProps: {
    //         nums: [
    //           {
    //             idType: "relId";
    //             context: "fe";
    //             // for each target, I need a sectionName, switchBaseName, and relative
    //           }
    //         ];
    //       };
    //       // I also need to know whether this requires a switch or not, and if so,
    //       // the switch.
    //     }
    //   >;
    // };
  },
  nextGet<
    SW extends SwitchName,
    SN extends BaseName<SW>,
    SB extends SwitchBase<SW, SN>,
    SP extends RelSwitchProps<SW>
  >(switchName: SW, sectionName: SN, baseName: SB, props: SP) {
    const nextProps = this.plusDefaultProps(
      switchName,
      sectionName,
      baseName,
      props
    );
    // I want to add

    // add one more layer that gives the props the correct updateArr props
    return this.general(switchName, sectionName, baseName, nextProps);
  },

  // there are two ways that I can go about the sumNums (and others)
  // 1. always just sum the varbs with the same ending. the switch is only visual
  // 2. sum one of the varbs (based on the ending) and calculate the rest based on that.
  // In isolation, 1 seems simpler and better.
  // But 2 matches what I already have to do with the editor.

  ongoingEditor<
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<"ongoing">
  >(sectionName: SN, baseName: Base, props: PR) {
    const names = switchVarbNames(baseName, "ongoing");
    // I can abstract away "ongoing", "monthsYears", etc.
    // I'm not sure how I abstract away the rest, though...
    // actually, maybe I do.
    // the first relUpdateInfo is the same each time for monthly and yearly
    // then followed by another updateInfo

    // I can include the name of the following updateInfo, as well as
    // the props it demands.

    // now plus updateFnProps
    return this.plusDefaultProps("ongoing", sectionName, baseName, {
      ...props,
      monthly: {
        updateInfoArr: [
          relUpdateInfo.ongoing.monthly(
            sectionName,
            names.yearly as VarbName<SN>,
            names.switch as VarbName<SN>
          ),
          relUpdateInfo.entityEditor,
        ],
        ...props.monthly,
      },
      yearly: {
        updateInfoArr: [
          relUpdateInfo.ongoing.yearly(
            sectionName,
            names.monthly as VarbName<SN>,
            names.switch as VarbName<SN>
          ),
          relUpdateInfo.entityEditor,
        ],
        ...props.yearly,
      },
    });
  },
  ongoingSumNums<
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<"ongoing">,
    NU extends BaseVarbInfo<"rel">[]
  >(sectionName: SN, baseName: Base, props: PR, nums: NU) {
    const names = switchVarbNames(baseName, "ongoing");
    return this.ongoing(sectionName, baseName, {
      ...props,
      monthly: {
        updateInfoArr: [
          // relUpdateInfo.ongoing.monthly(
          //   sectionName,
          //   names.yearly as VarbName<SN>,
          //   names.switch as VarbName<SN>
          // ),

          // the nums beings summed are different.
          // that's it.
          relUpdateInfo.sumNums(nums),
        ],
        ...props.monthly,
      },
      yearly: {
        updateInfoArr: [
          // relUpdateInfo.ongoing.yearly(
          //   sectionName,
          //   names.monthly as VarbName<SN>,
          //   names.switch as VarbName<SN>
          // ),
          relUpdateInfo.sumNums(nums),
        ],
        ...props.yearly,
      },
    });
  },

  // monthsYearsEditor<
  //   SN extends BaseName,
  //   Base extends string,
  //   PR extends RelSwitchProps<"monthsYears">
  // >(sectionName: SN, baseName: Base, props: PR) {
  //   const names = switchVarbNames(baseName, "monthsYears");
  //   return this.monthsYears(sectionName, baseName, {
  //     ...props,
  //     monthly: {
  //       updateInfoArr: [
  //         relUpdateInfo.ongoing.monthly(
  //           sectionName,
  //           names.yearly as VarbName<SN>,
  //           names.switch as VarbName<SN>
  //         ),
  //         relUpdateInfo.entityEditor,
  //       ],
  //       ...props.monthly,
  //     },
  //     yearly: {
  //       updateInfoArr: [
  //         relUpdateInfo.ongoing.yearly(
  //           sectionName,
  //           names.monthly as VarbName<SN>,
  //           names.switch as VarbName<SN>
  //         ),
  //         relUpdateInfo.entityEditor,
  //       ],
  //       ...props.yearly,
  //     },
  //   });
  // }
};

function _relVarbsSwitchSpecificTest() {
  const targetDis = "Taxes";
  const switchDis = "Taxes Ongoing Switch";
  const test = relVarbsSwitch.plusDefaultProps("ongoing", "property", "taxes", {
    monthly: { displayName: targetDis, startAdornment: "$" },
    yearly: { displayName: targetDis },
    switch: { displayName: switchDis },
  } as const);
  const _defaultAdorn: "" = test.taxesMonthly.endAdornment;
  const _startAdorn: "$" = test.taxesMonthly.startAdornment;
  const _tDis: typeof targetDis = test.taxesMonthly.displayName;
  const _sDis: typeof switchDis = test.taxesOngoingSwitch.displayName;
}

function _relVarbsOngoingTest() {
  const targetDis = "Taxes";
  const switchDis = "Taxes Ongoing Switch";
  const test = relVarbsSwitch.ongoingSumNums(
    "property",
    "taxes",
    {
      monthly: { displayName: targetDis, startAdornment: "$" },
      yearly: { displayName: targetDis },
      switch: { displayName: switchDis },
    } as const,
    [relVarbInfo.children("property", "taxes")]
  );
  const _defaultAdorn: "" = test.taxesMonthly.endAdornment;
  const _startAdorn: "$" = test.taxesMonthly.startAdornment;
  const _tDis: typeof targetDis = test.taxesMonthly.displayName;
  const _sDis: typeof switchDis = test.taxesOngoingSwitch.displayName;
}
