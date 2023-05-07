import { VarbNameByValueName } from "../baseSectionsDerived/baseSectionValues";
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
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import {
  dealCompletionStatus,
  financingCompletionStatus,
  mgmtCompletionStatus,
  propertyCompletionStatus,
} from "./calculatedUpdateVarbs/completionStatusVarbs";

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
    dealCompletionStatus,
    propertyCompletionStatus,
    financingCompletionStatus,
    mgmtCompletionStatus,
  };
}
