import { GroupKey, groupNameEnding } from "../GroupName";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import {
  OverrideBasics,
  uosb,
  uosbS,
} from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropsS,
  upsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  uO,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS, uvsS } from "../updateSectionVarbs/updateVarbs";
import { upS } from "./../updateSectionVarbs/updateVarb/UpdateFnProps";

export function loanUpdateVarbs(): USVS<"loan"> {
  return usvs("loan", {
    ...uvsS.savableSection,
    completionStatus: loanCompletionStatus(),
    financingMode: uvS.input("financingMode"),
    loanBaseDollars: uvS.loadNumObjChild("loanBaseValue", "valueDollars"),
    ...uvsS.childPeriodicEditor("interestRatePercent", "interestRateEditor"),
    ...uvsS.childTimespanEditor("loanTerm", "loanTermEditor"),
    // investmentExpenses = upfrontExpenses + delayedExpenses
    // cashExpenses = upfrontExpenses + prepaidExpenses
    // prepaidDaily: uvS.numObj({
    //   updateOverrides: updateOver
    // }),
    prepaidTaxes: loanPrepaidPeriodic("taxes"),
    prepaidHomeIns: loanPrepaidPeriodic("homeIns"),
    prepaidInterest: uvS.vsChildNumObj("prepaidInterest", "spanOrDollars", {
      valueDollarsEditor: ubS.loadChild(
        "prepaidInterest",
        "valueDollarsEditor"
      ),
      valueSpanEditor: ubS.multiply(
        "firstInterestPayment",
        upS.children("prepaidInterest", "valueSpanEditor")
      ),
    }),
    prepaidTotal: uvS.sumNums([
      "prepaidTaxes",
      "prepaidHomeIns",
      "prepaidInterest",
    ]),
    isInterestOnly: uvS.input("boolean", { initValue: false }),
    hasMortgageIns: uvS.input("boolean", { initValue: false }),
    mortgageInsUpfront: uvS.numObjO([
      updateOverride([osS.isFalse("hasMortgageIns")], ubS.zero),
      ...uosS.valueSource(
        "mortgageInsUpfrontSource",
        {
          valueDollarsEditor: ubS.loadChild(
            "mortgageInsUpfrontValue",
            "valueDollarsEditor"
          ),
          percentLoanEditor: ubS.equationLR(
            "multiply",
            upS.local("loanTotalDollars"),
            upS.onlyChild("mortgageInsUpfrontValue", "decimalOfLoan")
          ),
        },
        {
          sharedSwitches: [osS.isTrue("hasMortgageIns")],
          switchInfo: relVarbInfoS.onlyChild(
            "mortgageInsUpfrontValue",
            "valueSourceName"
          ),
        }
      ),
    ]),
    ...uvsS.periodic2("mortgageIns", {
      monthly: mortgageInsPeriodicOverrides("monthly"),
      yearly: mortgageInsPeriodicOverrides("yearly"),
    }),
    firstInterestPayment: uvS.multiply(
      "interestRateDecimalMonthly",
      "loanTotalDollars"
    ),
    firstInterestPaymentOneDay: uvS.divide(
      "firstInterestPayment",
      upS.varbPathName("thirty")
    ),
    loanTotalDollars: uvS.sumNums([upS.local("loanBaseDollars")]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [upS.localBaseName("loanPayment"), upS.localBaseName("mortgageIns")],
      "monthly"
    ),
    fivePercentBaseLoan: uvS.numEquation(
      "fivePercent",
      upS.local("loanBaseDollars")
    ),
    closingCosts: uvS.vsNumObj(
      "closingCostValueSource",
      {
        none: ubS.emptyNumObj,
        fivePercentLoan: ubS.loadLocal("fivePercentBaseLoan"),
        listTotal: ubS.sumNums(
          upS.children("closingCostValue", "valueDollars")
        ),
        valueDollarsEditor: ubS.sumNums(
          upS.children("closingCostValue", "valueDollars")
        ),
      },
      {
        switchInfo: relVarbInfoS.children(
          "closingCostValue",
          "valueSourceName"
        ),
      }
    ),
    ...uvsS.periodic2("interestRateDecimal", {
      monthly: ubS.percentToDecimal("interestRatePercentMonthly"),
      yearly: ubS.percentToDecimal("interestRatePercentYearly"),
    }),
    ...uvsS.periodic2("interestOnlySimple", {
      monthly: ubS.yearlyToMonthly2("interestOnlySimple"),
      yearly: ubS.fnName(
        "piInterestOnlySimpleYearly",
        upsS.localByVarbName("interestRateDecimalYearly", "loanTotalDollars")
      ),
    }),
    ...uvsS.periodic2("piFixedStandard", {
      monthly: ubS.fnName(
        "piFixedStandardMonthly",
        updateFnPropsS.localByVarbName(
          "loanTotalDollars",
          "interestRateDecimalMonthly",
          "loanTermMonths"
        )
      ),
      yearly: ubS.monthlyToYearly2("piFixedStandard"),
    }),
    ...uvsS.periodic2("averagePrincipal", {
      monthly: uosbS.boolean("isInterestOnly", {
        true: ubS.zero,
        false: ubS.divide("loanTotalDollars", "loanTermMonths"),
      }),
      yearly: uosbS.boolean("isInterestOnly", {
        true: ubS.zero,
        false: ubS.divide("loanTotalDollars", "loanTermYears"),
      }),
    }),
    ...uvsS.periodic2("averageInterest", {
      monthly: ubS.subtract("loanPaymentMonthly", "averagePrincipalMonthly"),
      yearly: ubS.subtract("loanPaymentYearly", "averagePrincipalYearly"),
    }),
    ...uvsS.periodic2("loanPayment", {
      monthly: uosbS.boolean("isInterestOnly", {
        true: ubS.loadLocal("interestOnlySimpleMonthly"),
        false: ubS.loadLocal("piFixedStandardMonthly"),
      }),
      yearly: uosbS.boolean("isInterestOnly", {
        true: ubS.loadLocal("interestOnlySimpleYearly"),
        false: ubS.loadLocal("piFixedStandardYearly"),
      }),
    }),
  });
}

function loanPrepaidPeriodic(baseName: "taxes" | "homeIns") {
  const childNames = {
    taxes: "prepaidTaxes",
    homeIns: "prepaidHomeIns",
  } as const;
  const childName = childNames[baseName];
  return uvS.numObjO([
    uO(
      [
        osS.childValueSourceIs(childName, "valueSpanEditor"),
        osS.local("financingMode", "purchase"),
        osS.varbIsValue("dealMode", "brrrr", "fixAndFlip"),
      ],
      ubS.multiply(
        upS.children(childName, "valueMonths"),
        upS.varbPathName(`${baseName}HoldingMonthly`)
      )
    ),
    uO(
      [osS.childValueSourceIs(childName, "valueSpanEditor")],
      ubS.multiply(
        upS.children(childName, "valueMonths"),
        upS.varbPathName(`${baseName}OngoingMonthly`)
      )
    ),
    uO(
      [osS.childValueSourceIs(childName, "valueDollarsEditor")],
      ubS.loadChild(childName, "valueDollarsEditor")
    ),
  ]);
}

function mortgageInsPeriodicOverrides(
  groupKey: GroupKey<"periodic">
): OverrideBasics {
  const ending = groupNameEnding("periodic", groupKey);
  return uosb([
    updateOverride([osS.isFalse("hasMortgageIns")], ubS.zero),
    ...uosS.valueSource(
      "mortgageInsPeriodic",
      {
        valueDollarsEditor: ubS.loadChild(
          "mortgageInsPeriodicValue",
          `valueDollars${ending}`
        ),
        valuePercentEditor: ubS.multiply(
          "loanTotalDollars",
          upS.onlyChild("mortgageInsPeriodicValue", `decimalOfLoan${ending}`)
        ),
      },
      {
        sharedSwitches: [osS.isTrue("hasMortgageIns")],
        switchInfo: relVarbInfoS.onlyChild(
          "mortgageInsPeriodicValue",
          "valueSourceName"
        ),
      }
    ),
  ]);
}

function loanCompletionStatus() {
  return uvS.completionStatusB({
    othersValid: [upS.onlyChild("loanBaseValue", "completionStatus")],
    notEmptySolvable: [
      upS.local("interestRatePercentMonthly"),
      upS.local("interestRatePercentYearly"),
      upS.local("loanTermMonths"),
      upS.local("loanTermYears"),
      upS.local("closingCosts"),
    ],
  });
}
