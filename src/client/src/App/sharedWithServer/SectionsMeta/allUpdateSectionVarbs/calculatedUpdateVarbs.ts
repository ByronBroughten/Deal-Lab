import { VarbNameByValueName } from "../baseSectionsDerived/baseSectionValues";
import { mixedInfoS } from "../SectionInfo/MixedSectionInfo";
import { UpdateGroup } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
} from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  completionStatusProps,
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitch,
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

function sumLoanVarb(
  loanVarbName: VarbNameByValueName<"loan", "numObj">
): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: [
      updateOverride(
        [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
        updateBasicsS.sumNums(
          updateFnPropS.pathNameBase("loanFocal", loanVarbName)
        )
      ),
      updateOverride(
        [overrideSwitchS.varbIsValue("financingMode", "cashOnly", "")],
        updateBasicsS.zero
      ),
    ],
  });
}

function sumOngoingLoanVarb<BN extends string>(
  financingBaseVarbName: BN,
  loanBaseVarbName: string
): UpdateGroup<BN, "ongoing"> {
  return updateVarbsS.ongoingSumNumsNext(financingBaseVarbName, "monthly", {
    updateBasics: updateBasicsS.throw,
    updateOverrides: [
      {
        switches: [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
        updateFnProps: [
          updateFnPropS.pathNameBase("loanFocal", loanBaseVarbName),
        ],
      },
      {
        switches: [
          overrideSwitchS.varbIsValue("financingMode", "cashOnly", ""),
        ],
        updateBasics: updateBasicsS.zero,
      },
    ],
  });
}

export function calculatedUpdateVarbs(): UpdateSectionVarbs<"calculatedVarbs"> {
  return {
    ...updateVarbsS._typeUniformity,
    downPaymentDollars: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.varbPathName("purchasePrice"),
      updateFnPropS.varbPathName("loanBaseDollars")
    ),
    downPaymentPercent: updateVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("downPaymentDecimal")
    ),
    downPaymentDecimal: updateVarbS.leftRightPropFn(
      "divide",
      updateFnPropS.local("downPaymentDollars"),
      updateFnPropS.varbPathName("purchasePrice")
    ),
    ...updateVarbsS.ongoingSumNumsNext("piti", "monthly", {
      updateFnProps: [
        updateFnPropS.varbPathBase("loanPayment"),
        updateFnPropS.varbPathBase("taxes"),
        updateFnPropS.varbPathBase("homeIns"),
        updateFnPropS.varbPathBase("mortgageIns"),
      ],
    }),
    loanBaseDollars: sumLoanVarb("loanBaseDollars"),
    loanTotalDollars: sumLoanVarb("loanTotalDollars"),
    closingCosts: sumLoanVarb("closingCosts"),
    mortgageInsUpfront: sumLoanVarb("mortgageInsUpfront"),
    loanUpfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.local("closingCosts"),
      updateFnPropS.local("mortgageInsUpfront"),
    ]),
    ...sumOngoingLoanVarb("loanExpenses", "expenses"),
    ...sumOngoingLoanVarb("mortgageIns", "mortgageIns"),
    ...sumOngoingLoanVarb("loanPayment", "loanPayment"),

    // Property
    two: updateVarb("numObj", updateBasics("two")),
    twelve: updateVarb("numObj", updateBasics("twelve")),
    onePercentPrice: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "onePercent",
        updateFnPropS.pathNameBase("propertyFocal", "purchasePrice")
      ),
    }),
    twoPercentPrice: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "twoPercent",
        updateFnPropS.pathNameBase("propertyFocal", "purchasePrice")
      ),
    }),
    fivePercentRentMonthly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "fivePercent",
        updateFnPropS.varbPathName("targetRentMonthly")
      ),
    }),
    fivePercentRentYearly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "fivePercent",
        updateFnPropS.varbPathName("targetRentYearly")
      ),
    }),
    tenPercentRentMonthly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "tenPercent",
        updateFnPropS.varbPathName("targetRentMonthly")
      ),
    }),
    tenPercentRentYearly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "tenPercent",
        updateFnPropS.varbPathName("targetRentYearly")
      ),
    }),
    onePercentPricePlusSqft: updateVarb("numObj", {
      ...updateBasicsS.sumVarbPathName("onePercentPrice", "sqft"),
    }),
    onePercentPriceSqftAverage: updateVarb("numObj", {
      ...updateBasicsS.varbPathLeftRight(
        "divide",
        "onePercentPricePlusSqft",
        "two"
      ),
    }),
    dealCompletionStatus: updateVarb("completionStatus", {
      initValue: "allEmpty",
      updateFnName: "completionStatus",
      updateFnProps: completionStatusProps({
        othersValid: [
          updateFnPropS.pathName(
            "calculatedVarbsFocal",
            "propertyCompletionStatus"
          ),
          updateFnPropS.pathName(
            "calculatedVarbsFocal",
            "financingCompletionStatus"
          ),
          updateFnPropS.pathName(
            "calculatedVarbsFocal",
            "mgmtCompletionStatus"
          ),
        ],
      }),
    }),
    propertyExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: {
        varbInfo: updateFnPropS.pathName("propertyFocal", "one"),
      },
    }),
    financingExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: {
        varbInfo: updateFnPropS.pathName("financingFocal", "one"),
      },
    }),
    mgmtExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: { varbInfo: updateFnPropS.pathName("mgmtFocal", "one") },
    }),
    propertyCompletionStatus: updateVarb("completionStatus", {
      initValue: "allEmpty",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.localIsFalse("propertyExists")],
          updateBasics(
            "completionStatus",
            completionStatusProps({
              notFalse: [updateFnPropS.local("propertyExists")],
            })
          )
        ),
      ],
      updateFnName: "completionStatus",
      updateFnProps: completionStatusProps({
        nonZeros: [updateFnPropS.pathName("propertyFocal", "numUnits")],
        nonNone: [
          updateFnPropS.pathName("repairCostFocal", "valueSourceName"),
          updateFnPropS.pathName("utilityCostFocal", "valueSourceName"),
          updateFnPropS.pathName("maintenanceCostFocal", "valueSourceName"),
          updateFnPropS.pathName("capExCostFocal", "valueSourceName"),
        ],
        validInputs: [
          ...updateFnPropsS.varbPathArr("purchasePrice", "sqft"),
          updateFnPropS.pathName("propertyFocal", "taxesOngoingEditor"),
          updateFnPropS.pathName("propertyFocal", "homeInsOngoingEditor"),
          // Separate the unit stuff into its own completion status eventually?
          // updateFnPropS.pathName("unitFocal", "targetRentOngoingEditor"),
          // updateFnPropS.pathName("unitFocal", "numBedrooms"),
          updateFnPropS.pathName("capExCostFocal", "valueDollarsEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("capExCostFocal", "valueSourceName"),
              "valueEditor"
            ),
          ]),
          updateFnPropS.pathName("repairCostFocal", "valueDollarsEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("repairCostFocal", "valueSourceName"),
              "valueEditor"
            ),
          ]),
          updateFnPropS.pathName("maintenanceCostFocal", "valueDollarsEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb(
                "maintenanceCostFocal",
                "valueSourceName"
              ),
              "valueEditor"
            ),
          ]),
        ],
      }),
    }),
    mgmtCompletionStatus: updateVarb("completionStatus", {
      initValue: "allEmpty",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.localIsFalse("mgmtExists")],
          updateBasics(
            "completionStatus",
            completionStatusProps({
              notFalse: [updateFnPropS.local("mgmtExists")],
            })
          )
        ),
      ],
      updateFnName: "completionStatus",
      updateFnProps: completionStatusProps({
        nonNone: [
          updateFnPropS.pathName("mgmtBasePayFocal", "valueSourceName"),
          updateFnPropS.pathName("vacancyLossFocal", "valueSourceName"),
        ],
        validInputs: [
          updateFnPropS.pathName(
            "mgmtBasePayFocal",
            "valueDollarsOngoingEditor",
            [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtBasePayFocal", "valueSourceName"),
                "dollarsEditor"
              ),
            ]
          ),
          updateFnPropS.pathName("mgmtBasePayFocal", "valuePercentEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("mgmtBasePayFocal", "valueSourceName"),
              "percentOfRentEditor"
            ),
          ]),
          updateFnPropS.pathName(
            "vacancyLossFocal",
            "valueDollarsOngoingEditor",
            [
              overrideSwitch(
                mixedInfoS.pathNameVarb("vacancyLossFocal", "valueSourceName"),
                "dollarsEditor"
              ),
            ]
          ),
          updateFnPropS.pathName("vacancyLossFocal", "valuePercentEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("vacancyLossFocal", "valueSourceName"),
              "percentOfRentEditor"
            ),
          ]),
        ],
      }),
    }),
    financingCompletionStatus: updateVarb("completionStatus", {
      initValue: "allEmpty",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.localIsFalse("financingExists")],
          updateBasics(
            "completionStatus",
            completionStatusProps({
              notFalse: [updateFnPropS.local("financingExists")],
            })
          )
        ),
        updateOverride(
          [overrideSwitchS.varbIsValue("financingMode", "", "cashOnly")],
          updateBasics(
            "completionStatus",
            completionStatusProps({
              validInputs: [updateFnPropS.varbPathName("financingMode")],
            })
          )
        ),
        updateOverride(
          [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
          updateBasics(
            "completionStatus",
            completionStatusProps({
              nonNone: [
                updateFnPropS.pathName("loanBaseFocal", "valueSourceName"),
                updateFnPropS.pathName("closingCostFocal", "valueSourceName"),
              ],
              validInputs: [
                updateFnPropS.pathName("loanBaseFocal", "valueDollarsEditor", [
                  overrideSwitchS.local("valueSourceName", "dollarsEditor"),
                ]),
                updateFnPropS.pathName(
                  "loanFocal",
                  "interestRatePercentOngoingEditor"
                ),
                updateFnPropS.pathName("loanFocal", "loanTermSpanEditor"),
                // Ultimately optional
                // updateFnPropS.pathName(
                //   "loanFocal",
                //   "mortgageInsUpfrontEditor",
                //   [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                // ),
                // updateFnPropS.pathName(
                //   "loanFocal",
                //   "mortgageInsOngoingEditor",
                //   [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                // ),
                updateFnPropS.pathName(
                  "closingCostFocal",
                  "valueDollarsEditor",
                  [overrideSwitchS.valueSourceIs("valueEditor")]
                ),
              ],
            })
          )
        ),
      ],
    }),
  };
}
