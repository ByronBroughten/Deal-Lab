import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { relVarb, relVarbS } from "../rel/relVarb";
import { UpdateBasics, updateBasicsS } from "../rel/relVarb/UpdateBasics";
import { updateFnPropS, updateFnPropsS } from "../rel/relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../rel/relVarb/UpdateOverrides";
import { RelVarbs, relVarbsS } from "../relVarbs";

function basePay() {
  const baseNames = switchNames("basePay", "dollarsPercentDecimal");
  const ongoingNames = switchNames(baseNames.dollars, "ongoing");
  const percentEditorName = `${baseNames.percent}Editor` as const;
  const dollarsEditorName = `${baseNames.dollars}Editor` as const;
  const baseDisplayName = "Base pay";
  return {
    [baseNames.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [baseNames.decimal]: relVarbS.numObj(`${baseDisplayName} decimal`, {
      initNumber: 0.05,
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
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
          )
        ),
      ],
    }),
    [percentEditorName]: relVarbS.percentObj(baseDisplayName, {
      initNumber: 0,
      endAdornment: "%",
    }),
    [baseNames.percent]: relVarbS.percentObj(baseDisplayName, {
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
      displayNameEnd: " percent",
    }),
    [ongoingNames.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    [dollarsEditorName]: relVarbS.moneyMonth(`${baseDisplayName} dollars`, {
      initNumber: 0,
    }),
    [ongoingNames.monthly]: relVarbS.moneyMonth(baseDisplayName, {
      displayNameEnd: " monthly",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
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
    [ongoingNames.yearly]: relVarbS.moneyYear(baseDisplayName, {
      displayNameEnd: " yearly",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentYearly")
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
  const baseNames = switchNames("vacancyLoss", "dollarsPercentDecimal");
  const ongoingNames = switchNames(baseNames.dollars, "ongoing");
  const percentEditorName = `${baseNames.percent}Editor` as const;
  const dollarsEditorName = `${baseNames.dollars}Editor` as const;
  const baseDisplayName = "Vacancy loss";
  return {
    [baseNames.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [baseNames.decimal]: relVarbS.numObj(`${baseDisplayName} decimal`, {
      initNumber: 0.05,
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
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
          )
        ),
      ],
    }),
    [percentEditorName]: relVarbS.percentObj(baseDisplayName, {
      initNumber: 0,
      endAdornment: "%",
    }),
    [baseNames.percent]: relVarbS.percentObj(baseDisplayName, {
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
      displayNameEnd: " percent",
    }),
    [ongoingNames.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    [dollarsEditorName]: relVarbS.moneyMonth(`${baseDisplayName} dollars`, {
      initNumber: 0,
    }),
    [ongoingNames.monthly]: relVarbS.moneyMonth(baseDisplayName, {
      displayNameEnd: " monthly",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
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
    [ongoingNames.yearly]: relVarbS.moneyYear(baseDisplayName, {
      displayNameEnd: " yearly",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentYearly")
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

export function mgmtRelVarbs(): RelVarbs<"mgmt"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    ...basePay(),
    ...vacancyLoss(),
    upfrontExpenses: relVarbS.sumNums(
      "Upfront expenses",
      [updateFnPropS.children("upfrontExpenseValue", "value")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        updateFnPropS.children("ongoingExpenseValue", "value"),
        ...updateFnPropsS.localArr(["vacancyLossDollars", "basePayDollars"]),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
  };
}
