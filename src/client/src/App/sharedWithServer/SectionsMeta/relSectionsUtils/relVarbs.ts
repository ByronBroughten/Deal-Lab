import { Obj } from "../../utils/Obj";
import { baseSections, SimpleSectionName } from "../baseSections";
import {
  BaseName,
  SectionVarbName,
  SectionVarbNameByType,
} from "../baseSectionsDerived/baseSectionTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { switchNames } from "../baseSectionsUtils/RelSwitchVarb";
import { ChildName } from "../childSectionsDerived/ChildName";
import { relVarbInfoS } from "../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../childSectionsDerived/RelVarbInfos";
import { relVarb, relVarbS } from "./rel/relVarb";
import {
  MonthlyYearlySwitchOptions,
  monthsYearsInput,
  ongoingInput,
  ongoingPercentToPortion,
  ongoingPureCalc,
  ongoingSumNums,
  SwitchRelVarbs,
} from "./rel/relVarbs/relOngoingVarbs";
import { switchInput } from "./rel/relVarbs/relSwitchVarbs";
import { RelVarb, RelVarbByType } from "./rel/relVarbTypes";

export type GeneralRelVarbs = Record<string, RelVarb>;
export type RelVarbs<SN extends SimpleSectionName> = Record<
  SectionVarbName<SN>,
  RelVarb
>;

type RelVarbsByType<SN extends SimpleSectionName, VLN extends ValueName> = Pick<
  RelVarbs<SN>,
  SectionVarbNameByType<SN, VLN>
>;

function isRelVarbOfType<SN extends BaseName<"hasVarb">, VLN extends ValueName>(
  sectionName: SN,
  varbName: SectionVarbName<SN>,
  valueName: VLN,
  _value: any
): _value is RelVarbByType[VLN] {
  const schema = baseSections["fe"][sectionName];
  const varbType =
    schema.varbSchemas[varbName as keyof typeof schema.varbSchemas];
  return varbType === valueName;
}

function filterRelVarbsByType<
  SN extends BaseName<"hasVarb">,
  VLN extends ValueName
>(
  sectionName: SN,
  valueName: VLN,
  relVarbs: RelVarbs<SN>
): RelVarbsByType<SN, VLN> {
  const partial: Partial<RelVarbsByType<SN, VLN>> = {};
  for (const [varbName, relVarb] of Obj.entriesFull(relVarbs)) {
    if (isRelVarbOfType(sectionName, varbName, valueName, relVarb))
      partial[varbName as keyof RelVarbsByType<SN, VLN>] = relVarb;
  }
  return partial as RelVarbsByType<SN, VLN>;
}

export type StringPreVarbsFromNames<VN extends readonly string[]> = Record<
  VN[number],
  RelVarbByType["string"]
>;
export const relVarbsS = {
  strings<VN extends readonly string[]>(
    varbNames: VN
  ): StringPreVarbsFromNames<VN> {
    return varbNames.reduce(
      (relVarbs, varbName): Partial<StringPreVarbsFromNames<VN>> => {
        return {
          ...relVarbs,
          [varbName]: relVarb("string"),
        };
      },
      {} as Partial<StringPreVarbsFromNames<VN>>
    ) as StringPreVarbsFromNames<VN>;
  },
  get savableSection() {
    return {
      ...this.strings([
        "title",
        "dateTimeFirstSaved",
        "dateTimeLastSaved",
      ] as const),
    };
  },
  ongoingPureCalc,
  ongoingPercentToPortion,
  ongoingSumNums,
  ongoingInput,
  monthsYearsInput,
  switchInput,
  timeMoneyInput<Base extends string>(
    varbNameBase: Base,
    displayName: string,
    options: MonthlyYearlySwitchOptions = {}
  ): SwitchRelVarbs<Base, "ongoing"> {
    return this.ongoingInput(varbNameBase, displayName, {
      ...options,
      shared: { ...options.shared, startAdornment: "$" },
    });
  },
  sectionStrings<
    SN extends BaseName<"hasVarb", "fe">,
    PV extends RelVarbs<SN>,
    ToSkip extends readonly (keyof PV)[] = []
  >(sectionName: SN, relVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<SN, "string">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }
    const ssPreVarbs: Partial<ToReturn> = {};
    const stringPreVarbs = filterRelVarbsByType(
      sectionName,
      "string",
      relVarbs
    );
    for (const [varbName, relVarb] of Obj.entriesFull(stringPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        ssPreVarbs[varbName] = relVarb;
      }
    }
    return ssPreVarbs as ToReturn;
  },
  sumSection<
    SN extends BaseName<"hasVarb"> & ChildName,
    RV extends RelVarbs<SN>,
    ToSkip extends readonly (keyof RV)[] = []
  >(sectionName: SN, relVarbs: RV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<SN, "numObj">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }

    const ssPreVarbs: Partial<ToReturn> = {};
    const numObjPreVarbs = filterRelVarbsByType(
      sectionName,
      "numObj",
      relVarbs
    );
    for (const [varbName, pVarb] of Obj.entriesFull(numObjPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        const { displayName, startAdornment, endAdornment } = pVarb;
        ssPreVarbs[varbName] = relVarbS.sumNums(
          displayName,
          [relVarbInfoS.children(sectionName, varbName)],
          { startAdornment, endAdornment }
        );
      }
    }
    return ssPreVarbs as ToReturn;
  },
  varbInfo() {
    return { varbInfo: relVarb("inEntityVarbInfo") } as const;
  },
  entityInfo() {
    return {
      ...this.varbInfo(),
      entityId: relVarb("string"),
    };
  },
  singleTimeItem<R extends RelVarbs<"singleTimeItem">>(): R {
    const sectionName = "singleTimeItem";
    const valueSwitchProp = relVarbInfoS.local("valueSwitch");
    const r: R = {
      name: relVarbS.stringOrLoaded(sectionName),
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      ...relVarbsS.entityInfo(),
      editorValue: relVarbS.calcVarb("", { startAdornment: "$" }),
      value: relVarbS.numObj(relVarbInfoS.local("name"), {
        updateFnName: "editorValue",
        updateFnProps: {
          proxyValue: relVarbInfoS.local("editorValue"),
          valueSwitch: valueSwitchProp,
        },
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              ...relVarbInfosS.localEntityInfo(),
              valueSwitch: valueSwitchProp,
            },
          },
        ],
        startAdornment: "$",
      }),
    } as R;
    return r;
  },
  ongoingItem(): RelVarbs<"ongoingItem"> {
    const sectionName = "ongoingItem";
    const ongoingValueNames = switchNames("value", "ongoing");

    const defaultValueUpdatePack = {
      updateFnName: "editorValue",
      updateFnProps: relVarbInfosS.localByVarbName([
        "editorValue",
        "valueSwitch",
      ]),
    } as const;
    const ongoingSwitchInfo = relVarbInfoS.local(ongoingValueNames.switch);
    const valueSwitchProp = relVarbInfoS.local("valueSwitch");
    return {
      name: relVarbS.stringOrLoaded(sectionName),
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),

      ...relVarbsS.entityInfo(),
      costToReplace: relVarbS.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),

      editorValue: relVarbS.calcVarb("", {
        startAdornment: "$",
        endAdornment: "provide adornment to editor",
      }),
      ...relVarbsS.monthsYearsInput("lifespan", "Average lifespan", {
        switchInit: "years",
      }),
      [ongoingValueNames.switch]: relVarb("string", {
        initValue: "yearly",
      }),
      // So... that's the editorValue, is that right?

      [ongoingValueNames.monthly]: relVarbS.moneyMonth("Monthly amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "yearly",
            updateFnName: "yearlyToMonthly",
            updateFnProps: {
              num: relVarbInfoS.local(ongoingValueNames.yearly),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relVarbInfosS.localEntityInfo(),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfoS.local("costToReplace"),
              rightSide: relVarbInfoS.local("lifespanMonths"),
            },
          },
        ],
      }),
      [ongoingValueNames.yearly]: relVarbS.moneyYear("Annual amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "monthly",
            updateFnName: "monthlyToYearly",
            updateFnProps: {
              num: relVarbInfoS.local(ongoingValueNames.monthly),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relVarbInfosS.localEntityInfo(),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfoS.local("costToReplace"),
              rightSide: relVarbInfoS.local("lifespanYears"),
            },
          },
        ],
      }),
    };
  },
  singleTimeList(): RelVarbs<"singleTimeList"> {
    return {
      ...this.savableSection,
      total: relVarbS.sumNums(
        relVarbInfoS.local("title"),
        [relVarbInfoS.children("singleTimeItem", "value")],
        { startAdornment: "$" }
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    };
  },
  ongoingList(): RelVarbs<"ongoingList"> {
    return {
      ...this.savableSection,
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
      ...relVarbsS.ongoingSumNums(
        "total",
        relVarbInfoS.local("title"),
        [relVarbInfoS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    };
  },
};
