import { switchKeyToVarbNames } from "../allBaseSectionVarbs/baseSwitchNames";
import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import {
  UpdateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    one: updateVarbS.one(),
    ...updateGroupS.group("basePayDollars", "ongoing", "monthly", {
      monthly: updateBasicsS.loadFromChild(
        "mgmtBasePayValue",
        "valueDollarsMonthly"
      ),
      yearly: updateBasicsS.loadFromChild(
        "mgmtBasePayValue",
        "valueDollarsYearly"
      ),
    }),
    basePayPercent: updateVarb(
      "numObj",
      updateBasicsS.loadFromChild("mgmtBasePayValue", "valuePercent")
    ),
    ...vacancyLoss(),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    upfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.children("upfrontExpenseGroup", "total", [
        overrideSwitchS.pathHasValue("mgmtFocal", "useCustomCosts", true),
      ]),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        ...updateFnPropsS.localBaseNameArr([
          "basePayDollars",
          "vacancyLossDollars",
        ]),
        updateFnPropS.onlyChild("ongoingExpenseGroup", "total", [
          overrideSwitchS.pathHasValue("mgmtFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
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
            updateFnPropS.pathNameBase("propertyFocal", "targetRentMonthly")
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
            updateFnPropS.pathNameBase("propertyFocal", "targetRentMonthly")
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
            updateFnPropS.pathNameBase("propertyFocal", "targetRentYearly")
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
