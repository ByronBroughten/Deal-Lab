import { switchKeyToVarbNames } from "../../baseSectionsVarbs/baseSwitchNames";
import { relVarbS, updateVarb } from "../rel/updateVarb";
import { UpdateBasics, updateBasicsS } from "../rel/updateVarb/UpdateBasics";
import { updateFnPropS, updateFnPropsS } from "../rel/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../rel/updateVarb/UpdateOverrides";
import { UpdateSectionVarbs, updateVarbsS } from "../updateVarbs";

export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...basePay(),
    ...vacancyLoss(),
    upfrontExpenses: relVarbS.sumNums([
      updateFnPropS.children("upfrontExpenseValue", "value"),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        updateFnPropS.children("ongoingExpenseValue", "value"),
        ...updateFnPropsS.localArr(["vacancyLossDollars", "basePayDollars"]),
      ],
      "monthly"
    ),
  };
}

function basePay() {
  const baseNames = switchKeyToVarbNames("basePay", "dollarsPercentDecimal");
  const ongoingNames = switchKeyToVarbNames(baseNames.dollars, "ongoing");
  const percentEditorName = `${baseNames.percent}Editor` as const;
  const dollarsEditorName = `${baseNames.dollars}Editor` as const;
  return {
    [baseNames.switch]: updateVarb("string", {
      initValue: "percent",
    }),
    [baseNames.decimal]: updateVarb("numObj", {
      updateFnName: "percentToDecimal",
      updateFnProps: {
        num: updateFnPropS.local(baseNames.percent),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationLeftRight(
            "simpleDivide",
            updateFnPropS.local(ongoingNames.monthly),
            updateFnPropS.pathName("propertyFocal", "targetRentMonthly")
          )
        ),
      ],
    }),
    [percentEditorName]: updateVarb("numObj"),
    [baseNames.percent]: updateVarb("numObj", {
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        varbInfo: updateFnPropS.local(percentEditorName),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local(baseNames.decimal)
          )
        ),
      ],
    }),
    [ongoingNames.switch]: updateVarb("string", {
      initValue: "monthly",
    }),
    [dollarsEditorName]: updateVarb("numObj"),
    [ongoingNames.monthly]: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyFocal", "targetRentMonthly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.monthlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.loadFromLocal(
            dollarsEditorName
          ) as UpdateBasics<"numObj">
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.yearlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.yearlyToMonthly(baseNames.dollars)
        ),
      ],
    }),
    [ongoingNames.yearly]: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyFocal", "targetRentYearly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.monthlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.monthlyToYearly(baseNames.dollars)
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.yearlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.loadFromLocal(
            dollarsEditorName
          ) as UpdateBasics<"numObj">
        ),
      ],
    }),
  };
}

function vacancyLoss() {
  const baseNames = switchKeyToVarbNames(
    "vacancyLoss",
    "dollarsPercentDecimal"
  );
  const ongoingNames = switchKeyToVarbNames(baseNames.dollars, "ongoing");
  const percentEditorName = `${baseNames.percent}Editor` as const;
  const dollarsEditorName = `${baseNames.dollars}Editor` as const;
  return {
    [baseNames.switch]: updateVarb("string", {
      initValue: "percent",
    }),
    [baseNames.decimal]: updateVarb("numObj", {
      updateFnName: "percentToDecimal",
      updateFnProps: {
        num: updateFnPropS.local(baseNames.percent),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationLeftRight(
            "simpleDivide",
            updateFnPropS.local(ongoingNames.monthly),
            updateFnPropS.pathName("propertyFocal", "targetRentMonthly")
          )
        ),
      ],
    }),
    [percentEditorName]: updateVarb("numObj"),
    [baseNames.percent]: updateVarb("numObj", {
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: { varbInfo: updateFnPropS.local(percentEditorName) },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local(baseNames.decimal)
          )
        ),
      ],
    }),
    [ongoingNames.switch]: updateVarb("string", {
      initValue: "monthly",
    }),
    [dollarsEditorName]: updateVarb("numObj"),
    [ongoingNames.monthly]: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyFocal", "targetRentMonthly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.monthlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.loadFromLocal(
            dollarsEditorName
          ) as UpdateBasics<"numObj">
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.yearlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.yearlyToMonthly(baseNames.dollars)
        ),
      ],
    }),
    [ongoingNames.yearly]: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyFocal", "targetRentYearly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.monthlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.monthlyToYearly(baseNames.dollars)
        ),
        updateOverride(
          [
            overrideSwitchS.local(baseNames.switch, "dollars"),
            overrideSwitchS.yearlyIsActive(baseNames.dollars),
          ],
          updateBasicsS.loadFromLocal(
            dollarsEditorName
          ) as UpdateBasics<"numObj">
        ),
      ],
    }),
  };
}
