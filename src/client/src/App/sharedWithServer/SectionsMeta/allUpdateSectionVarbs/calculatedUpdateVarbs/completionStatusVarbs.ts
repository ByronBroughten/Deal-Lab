import { Arr } from "../../../utils/Arr";
import { mixedInfoS } from "../../SectionInfo/MixedSectionInfo";
import { sectionPathNames } from "../../sectionPathContexts/sectionPathNames";
import { updateVarb, UpdateVarb } from "../../updateSectionVarbs/updateVarb";
import {
  UpdateFnProp,
  updateFnPropS,
  updateFnPropsS,
} from "../../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitch,
  overrideSwitchS,
  updateOverride,
  UpdateOverrides,
} from "../../updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  completionStatusBasics,
  completionStatusProps,
  completionStatusVarb,
  dealModeOverrides,
  valueSourceOverrides,
} from "../../updateSectionVarbs/updateVarb/updateVarbUtils";
import { unionValueArr } from "../../values/StateValue/unionValues";

const propS = updateFnPropS;
const propsS = updateFnPropsS;
const cBasics = completionStatusBasics;
const oSwitch = overrideSwitch;
const switchS = overrideSwitchS;

export const dealCompletionStatus = updateVarb("completionStatus", {
  initValue: "allEmpty",
  updateFnName: "completionStatus",
  updateFnProps: completionStatusProps({
    othersValid: [
      propS.pathName("calculatedVarbsFocal", "propertyCompletionStatus"),
      propS.pathName("calculatedVarbsFocal", "financingCompletionStatus"),
      propS.pathName("calculatedVarbsFocal", "mgmtCompletionStatus"),
    ],
  }),
});

function propertySharedValidInputs(): UpdateFnProp[] {
  return [
    ...propsS.varbPathArr("purchasePrice", "sqft"),
    propS.pathName("propertyFocal", "taxesOngoingEditor"),
    propS.pathName("propertyFocal", "homeInsOngoingEditor"),
    propS.pathName("repairCostFocal", "valueDollarsEditor", [
      overrideSwitch(
        mixedInfoS.pathNameVarb("repairCostFocal", "valueSourceName"),
        "valueEditor"
      ),
    ]),
    propS.pathName("costOverrunFocal", "valueDollarsEditor", [
      oSwitch(
        mixedInfoS.pathNameVarb("costOverrunFocal", "valueSourceName"),
        "valueDollarsEditor"
      ),
    ]),
    propS.pathName("costOverrunFocal", "valuePercentEditor", [
      oSwitch(
        mixedInfoS.pathNameVarb("costOverrunFocal", "valueSourceName"),
        "valuePercentEditor"
      ),
    ]),
  ];
}

export const propertyCompletionStatus = completionStatusVarb(
  updateOverride(
    [switchS.localIsFalse("propertyExists")],
    cBasics({
      notFalse: [propS.local("propertyExists")],
    })
  ),
  ...dealModeOverrides(
    {
      buyAndHold: cBasics({
        nonZeros: [propS.pathName("propertyFocal", "numUnits")],
        nonNone: [
          propS.pathName("repairCostFocal", "valueSourceName"),
          propS.pathName("utilityCostFocal", "valueSourceName"),
          propS.pathName("maintenanceCostFocal", "valueSourceName"),
          propS.pathName("capExCostFocal", "valueSourceName"),
        ],
        validInputs: [
          ...propertySharedValidInputs(),
          // Separate the unit stuff into its own completion status?
          // propS.pathName("unitFocal", "targetRentOngoingEditor"),
          // propS.pathName("unitFocal", "numBedrooms"),
          propS.pathName("capExCostFocal", "valueDollarsEditor", [
            oSwitch(
              mixedInfoS.pathNameVarb("capExCostFocal", "valueSourceName"),
              "valueEditor"
            ),
          ]),
          propS.pathName("maintenanceCostFocal", "valueDollarsEditor", [
            oSwitch(
              mixedInfoS.pathNameVarb(
                "maintenanceCostFocal",
                "valueSourceName"
              ),
              "valueEditor"
            ),
          ]),
        ],
      }),
      fixAndFlip: cBasics({
        nonNone: [propS.pathName("repairCostFocal", "valueSourceName")],
        validInputs: [
          ...propertySharedValidInputs(),
          propS.pathName("propertyFocal", "holdingPeriodSpanEditor"),
          propS.pathName("propertyFocal", "numUnitsEditor"),
        ],
      }),
    },
    mixedInfoS.varbPathName("dealMode")
  )
);

const loanPathNames = Arr.extractStrict(sectionPathNames, [
  "purchaseLoanFocal",
  "repairLoanFocal",
  "arvLoanFocal",
] as const);

type LoanPathName = typeof loanPathNames[number];

function noFinancingOverride() {
  return updateOverride(
    [switchS.localIsFalse("financingExists")],
    cBasics({
      notFalse: [propS.local("financingExists")],
    })
  );
}

export function loanValueCompletionStatus(
  loanPathName: LoanPathName
): UpdateVarb<"completionStatus"> {
  const sourceNames = unionValueArr("percentDollarsSource");
  const extraOverrides = sourceNames.reduce((overrides, sourceName) => {
    overrides.push(
      updateOverride(
        [switchS.pathHasValue(loanPathName, "valueSourceName", sourceName)],
        cBasics({
          validInputs: [propS.pathName(loanPathName, sourceName)],
        })
      )
    );
    return overrides;
  }, [] as UpdateOverrides);
  return completionStatusVarb(
    // noFinancingOverride(),
    ...extraOverrides
  );
}

export const baseLoanCompletionStatus = completionStatusVarb(
  // noFinancingOverride(),
  ...valueSourceOverrides(
    "loanBaseValueSource",
    {
      purchaseLoanValue: cBasics({
        othersValid: [propS.local("purchaseLoanCompletionStatus")],
      }),
      repairLoanValue: cBasics({
        othersValid: [propS.local("repairLoanCompletionStatus")],
      }),
      arvLoanValue: cBasics({
        othersValid: [propS.local("arvLoanCompletionStatus")],
      }),
      priceAndRepairValues: cBasics({
        othersValid: [
          propS.local("purchaseLoanCompletionStatus"),
          propS.local("repairLoanCompletionStatus"),
        ],
      }),
      customAmountEditor: cBasics({
        validInputs: [propS.pathName("loanBaseFocal", "valueDollarsEditor")],
      }),
    },
    mixedInfoS.pathNameVarb("loanBaseFocal", "valueSourceName")
  )
);

export const financingCompletionStatus = completionStatusVarb(
  // noFinancingOverride(),
  updateOverride(
    [switchS.varbIsValue("financingMode", "", "cashOnly")],
    cBasics({
      validInputs: [propS.varbPathName("financingMode")],
    })
  ),
  updateOverride(
    [switchS.varbIsValue("financingMode", "useLoan")],
    cBasics({
      othersValid: [propS.local("baseLoanCompletionStatus")],
      nonNone: [propS.pathName("closingCostFocal", "valueSourceName")],
      validInputs: [
        propS.pathName("loanFocal", "interestRatePercentOngoingEditor"),
        propS.pathName("loanFocal", "loanTermSpanEditor"),
        propS.pathName("closingCostFocal", "valueDollarsEditor", [
          switchS.valueSourceIs("valueEditor"),
        ]),
      ],
    })
  )
);

export const mgmtCompletionStatus = completionStatusVarb(
  updateOverride(
    [switchS.localIsFalse("mgmtExists")],
    cBasics({
      notFalse: [propS.local("mgmtExists")],
    })
  ),
  ...dealModeOverrides(
    {
      fixAndFlip: cBasics({
        notFalse: [propS.local("mgmtExists")],
      }),
      buyAndHold: cBasics({
        nonNone: [
          propS.pathName("mgmtBasePayFocal", "valueSourceName"),
          propS.pathName("vacancyLossFocal", "valueSourceName"),
        ],
        validInputs: [
          propS.pathName("mgmtBasePayFocal", "valueDollarsOngoingEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("mgmtBasePayFocal", "valueSourceName"),
              "dollarsEditor"
            ),
          ]),
          propS.pathName("mgmtBasePayFocal", "valuePercentEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("mgmtBasePayFocal", "valueSourceName"),
              "percentOfRentEditor"
            ),
          ]),
          propS.pathName("vacancyLossFocal", "valueDollarsOngoingEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("vacancyLossFocal", "valueSourceName"),
              "dollarsEditor"
            ),
          ]),
          propS.pathName("vacancyLossFocal", "valuePercentEditor", [
            overrideSwitch(
              mixedInfoS.pathNameVarb("vacancyLossFocal", "valueSourceName"),
              "percentOfRentEditor"
            ),
          ]),
        ],
      }),
    },
    mixedInfoS.varbPathName("dealMode")
  )
);
