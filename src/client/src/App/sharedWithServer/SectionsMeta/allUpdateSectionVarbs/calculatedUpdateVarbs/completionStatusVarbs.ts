import { mixedInfoS } from "../../SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
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
      propS.pathName("propertyFocal", "completionStatus"),
      propS.pathName("calculatedVarbsFocal", "financingCompletionStatus"),
      propS.pathName("calculatedVarbsFocal", "mgmtCompletionStatus"),
    ],
  }),
});

function hasOngoingNoneNones(): UpdateFnProp[] {
  return [
    propS.onlyChild("repairValue", "valueSourceName"),
    propS.onlyChild("utilityValue", "valueSourceName"),
    propS.onlyChild("maintenanceValue", "valueSourceName"),
    propS.onlyChild("capExValue", "valueSourceName"),
  ];
}
function hasOngoingValidInputs(): UpdateFnProp[] {
  return [
    propS.onlyChild("capExValue", "valueDollarsOngoingEditor", [
      oSwitch(
        relVarbInfoS.local("valueSourceName"),
        "valueDollarsOngoingEditor"
      ),
    ]),
    propS.onlyChild("maintenanceValue", "valueDollarsOngoingEditor", [
      oSwitch(
        relVarbInfoS.local("valueSourceName"),
        "valueDollarsOngoingEditor"
      ),
    ]),
  ];
}

function propertySharedValidInputs(): UpdateFnProp[] {
  return [
    ...propsS.localArr(
      "purchasePrice",
      "sqft",
      "taxesOngoingEditor",
      "homeInsOngoingEditor"
    ),
    propS.onlyChild("repairValue", "valueDollarsEditor", [
      oSwitch(relVarbInfoS.local("valueSourceName"), "valueDollarsEditor"),
    ]),
    propS.onlyChild("costOverrunValue", "valueDollarsEditor", [
      oSwitch(relVarbInfoS.local("valueSourceName"), "valueDollarsEditor"),
    ]),
    propS.onlyChild("costOverrunValue", "valuePercentEditor", [
      oSwitch(relVarbInfoS.local("valueSourceName"), "valuePercentEditor"),
    ]),
  ];
}

export const propertyCompletionStatus = completionStatusVarb(
  ...dealModeOverrides(
    {
      homeBuyer: cBasics({
        nonNone: hasOngoingNoneNones(),
        validInputs: [
          ...propertySharedValidInputs(),
          ...hasOngoingValidInputs(),
        ],
      }),
      buyAndHold: cBasics({
        nonZeros: [propS.local("numUnits")],
        nonNone: hasOngoingNoneNones(),
        validInputs: [
          ...propertySharedValidInputs(),
          ...hasOngoingValidInputs(),
        ],
      }),
      fixAndFlip: cBasics({
        nonNone: [propS.pathName("repairCostFocal", "valueSourceName")],
        validInputs: [
          ...propertySharedValidInputs(),
          propS.local("holdingPeriodSpanEditor"),
          propS.local("numUnitsEditor"),
        ],
      }),
    },
    relVarbInfoS.local("propertyMode")
  )
);

export function loanValueCompletionStatus(): UpdateVarb<"completionStatus"> {
  const sourceNames = unionValueArr("percentDollarsSource");
  const extraOverrides = sourceNames.reduce((overrides, sourceName) => {
    overrides.push(
      updateOverride(
        [switchS.local("valueSourceName", sourceName)],
        cBasics({
          validInputs: [propS.local(sourceName)],
        })
      )
    );
    return overrides;
  }, [] as UpdateOverrides);
  return completionStatusVarb(...extraOverrides);
}

export function baseLoanCompletionStatus() {
  return completionStatusVarb(
    ...valueSourceOverrides("loanBaseValueSource", {
      purchaseLoanValue: cBasics({
        othersValid: [propS.onlyChild("purchaseLoanValue", "completionStatus")],
      }),
      repairLoanValue: cBasics({
        othersValid: [propS.onlyChild("repairLoanValue", "completionStatus")],
      }),
      arvLoanValue: cBasics({
        othersValid: [propS.onlyChild("arvLoanValue", "completionStatus")],
      }),
      priceAndRepairValues: cBasics({
        othersValid: [
          propS.onlyChild("purchaseLoanValue", "completionStatus"),
          propS.onlyChild("repairLoanValue", "completionStatus"),
        ],
      }),
      customAmountEditor: cBasics({
        validInputs: [propS.local("valueDollarsEditor")],
      }),
    })
  );
}

export const financingCompletionStatus = completionStatusVarb(
  updateOverride(
    [switchS.varbIsValue("financingMode", "", "cashOnly")],
    cBasics({
      validInputs: [propS.varbPathName("financingMode")],
    })
  ),
  updateOverride(
    [switchS.varbIsValue("financingMode", "useLoan")],
    cBasics({
      othersValid: [propS.pathName("loanBaseFocal", "completionStatus")],
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
      homeBuyer: cBasics({
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
      fixAndFlip: cBasics({
        notFalse: [propS.local("mgmtExists")],
      }),
    },
    mixedInfoS.varbPathName("dealMode")
  )
);
