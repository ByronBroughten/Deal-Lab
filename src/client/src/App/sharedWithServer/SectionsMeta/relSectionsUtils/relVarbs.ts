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
  const schema = baseSections[sectionName];
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
        "displayName",
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
    SN extends BaseName<"hasVarb">,
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
        const { displayName, startAdornment, endAdornment, displayNameEnd } =
          pVarb;
        ssPreVarbs[varbName] = relVarbS.sumNums(
          displayName,
          [relVarbInfoS.children(sectionName, varbName)],
          { startAdornment, endAdornment, displayNameEnd }
        );
      }
    }
    return ssPreVarbs as ToReturn;
  },
  get listItem() {
    return {
      // displayName: relVarbS.stringOrLoaded(),
      displayName: relVarb("stringObj"),
      displayNameEnd: relVarb("stringObj"),
    } as const;
  },
  get singleVirtualVarb() {
    return {
      ...this.listItem,
      value: relVarb("numObj"),
    };
  },
  singleTimeItem(): RelVarbs<"singleTimeItem"> {
    const valueSwitchProp = relVarbInfoS.local("valueSwitch");
    return {
      ...this.listItem,
      value: relVarbS.numObj(relVarbInfoS.local("displayName"), {
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
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
              valueSwitch: valueSwitchProp,
            },
          },
          // the total is updating right away.
          // and the total must update based on
        ],
        startAdornment: "$",
      }),
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      valueEntityInfo: relVarb("inEntityVarbInfo"),
      editorValue: relVarbS.calcVarb("", { startAdornment: "$" }),
    };
  },
  ongoingItem(): RelVarbs<"ongoingItem"> {
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
      ...this.listItem,
      // loading a varbInfo gives the displayName an inEntity
      // or it just changes the displayName to a static displayName

      // basic loaded value
      // load the varbInfo
      // give value an entity

      // What happens is that the item's value
      // isn't updating in time

      // I know I solved this once before.

      // For right now, I can actually do away with loadedVarbs
      // Anyways, when an entity is not present, this varb copies
      // the one it is linked to, or maintains a static displayName

      // hmmm, interesting.

      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      valueEntityInfo: relVarb("inEntityVarbInfo"),
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
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
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
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
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
        relVarbInfoS.local("displayName"),
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
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    };
  },
};
