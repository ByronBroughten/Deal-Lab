import { RelVarb, relVarb, RelVarbOptions, RelVarbProps } from "../relVarb";
import {
  isSwitchVarbNames,
  SwitchName,
  BaseSwitchSchemas,
  switchVarbNames,
  SwitchTargetKeys,
} from "../../baseSections/baseSwitchSchemas";
import { Merge } from "../../../../../utils/Obj/merge";
import { relUpdateInfo } from "./../relUpdateInfoArr";
import { Obj } from "../../../../../utils/Obj";
import { BaseName, VarbName } from "../../BaseName";
import { BaseVarbInfo } from "../../baseVarbInfo";
import { relVarbInfo } from "./../relVarbInfo";
// The complete way to do this is to make an array of baseNames
// in each section that contains switchVarbs
// then make something that takes a baseName and the appropriate ending
// and produces a varbName

type TargetProps<EN extends SwitchName> = {
  [Prop in SwitchTargetKeys<EN>]: RelVarbProps<"numObj">;
};

type RelSwitchProps<EN extends SwitchName = SwitchName> =
  TargetProps<EN> & {
    switch: RelVarbProps<"string">;
  } & {
    targets?: RelVarbOptions<"numObj">;
  };

type RelSwitchTargets<
  Base extends string,
  EN extends SwitchName,
  PR extends TargetProps<EN>,
  TO extends RelVarbOptions<"numObj"> = {},
  Endings = BaseSwitchSchemas[EN]["targets"]
> = {
  [TN in keyof PR as `${Base}${Endings[TN & keyof Endings] & string}`]: RelVarb<
    "numObj",
    PR[TN]["displayName"],
    Merge<TO, PR[TN]>
  >;
};
type RelSwitchVarbs<
  Base extends string,
  EN extends SwitchName,
  O extends RelSwitchProps<EN>
> = RelSwitchTargets<Base, EN, O & {}, O["targets"]> & {
  [B in Base as `${B}${BaseSwitchSchemas[EN]["switch"] & string}`]: RelVarb<
    "string",
    O["switch"]["displayName"],
    O["switch"]
  >;
};

const defaultSwitch = {
  updateInfoArr: [
    {
      updateName: "direct",
      updateProps: {},
    },
  ],
} as const;

type RelSwitchDefaultProps<
  EN extends SwitchName,
  PR extends RelSwitchProps<EN>
> = {
  targets?: PR["targets"];
  switch: Merge<typeof defaultSwitch, PR["switch"]>;
} & {
  [Prop in SwitchTargetKeys<EN>]: PR[Prop];
};

export const relVarbsSwitch = {
  general<
    Base extends string,
    EN extends SwitchName,
    O extends RelSwitchProps<EN>
  >(baseName: Base, endingName: EN, props: O) {
    const names = switchVarbNames(baseName, endingName);
    const targetRelVarbs = Obj.keys(names).reduce((tRelVarbs, tName) => {
      if (tName === "switch") return tRelVarbs;
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
      [names.switch]: relVarb.string(props.switch.displayName, props.switch),
      ...targetRelVarbs,
    } as RelSwitchVarbs<Base, EN, O>;
  },
  specific<
    EN extends SwitchName,
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<EN>
  >(endingName: EN, sectionName: SN, baseName: Base, props: PR) {
    const names = switchVarbNames(baseName, endingName);
    if (isSwitchVarbNames(sectionName, endingName, names)) {
      type NPR = RelSwitchDefaultProps<EN, PR> & {
        switch: {
          displayName: RelSwitchDefaultProps<EN, PR>["switch"]["displayName"];
        };
      };

      const nextProps = Obj.keys(props).reduce<NPR>((pr, propName) => {
        if (propName === "targets") return pr;
        else if (propName === "switch")
          return Obj.update(
            pr,
            propName as "switch",
            Obj.merge(defaultSwitch, props[propName]) as any as NPR["switch"]
          );
        else
          return Obj.update(pr, propName as any, {
            // add default update stuff here
            ...props[propName],
          });
      }, {} as NPR);

      return this.general(baseName, endingName, nextProps);
    } else throw new Error("The switchVarbNames must be varbNames.");
  },
  monthsYears<
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<"ongoing">,
    IN extends string="months"
  >() {
    return this.specific("monthsYears", sectionName, baseName, {
      ...props
      switch: {
        initValue: initValue ?? "months" as IN,
        ...props.switch
      },
      monthly: {
        endAdornment: "months",
        ...props.monthly
      },
      yearly: {
        endAdornment: "years",
        ...props.yearly
      }
    })
  },
  ongoing<
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<"ongoing">,
    IN extends string="monthly"
  >(sectionName: SN, baseName: Base, props: PR, initValue?: IN) {
    return this.specific("ongoing", sectionName, baseName, {
      ...props
      switch: {
        initValue: initValue ?? "monthly" as IN,
        ...props.switch
      },
      monthly: {
        endAdornment: "/month",
        ...props.monthly
      },
      yearly: {
        endAdornment: "/year",
        ...props.yearly
      }
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
  ongoingEditor<
    SN extends BaseName,
    Base extends string,
    PR extends RelSwitchProps<"ongoing">
  >(sectionName: SN, baseName: Base, props: PR) {
    const names = switchVarbNames(baseName, "ongoing");
    return this.ongoing(sectionName, baseName, {
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
};

function _relVarbsSwitchSpecificTest() {
  const targetDis = "Taxes";
  const switchDis = "Taxes Ongoing Switch";
  const test = relVarbsSwitch.specific("ongoing", "property", "taxes", {
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
