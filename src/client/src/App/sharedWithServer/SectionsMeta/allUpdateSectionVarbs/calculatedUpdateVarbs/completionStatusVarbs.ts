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

export const dealCompletionStatus = completionStatusVarb(
  ...dealModeOverrides({
    homeBuyer: cBasics({
      othersValid: [
        propS.onlyChild("property", "completionStatus"),
        propS.onlyChild("purchaseFinancing", "completionStatus"),
      ],
    }),
    buyAndHold: cBasics({
      othersValid: [
        propS.onlyChild("property", "completionStatus"),
        propS.onlyChild("purchaseFinancing", "completionStatus"),
        propS.onlyChild("mgmt", "completionStatus"),
      ],
    }),
    fixAndFlip: cBasics({
      othersValid: [
        propS.onlyChild("property", "completionStatus"),
        propS.onlyChild("purchaseFinancing", "completionStatus"),
      ],
    }),
    brrrr: cBasics({
      othersValid: [
        propS.onlyChild("property", "completionStatus"),
        propS.onlyChild("purchaseFinancing", "completionStatus"),
        propS.onlyChild("refiFinancing", "completionStatus"),
        propS.onlyChild("mgmt", "completionStatus"),
      ],
    }),
  })
);

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
      brrrr: cBasics({
        nonZeros: [propS.local("numUnits")],
        nonNone: [
          propS.pathName("repairCostFocal", "valueSourceName"),
          ...hasOngoingNoneNones(),
        ],
        validInputs: [
          ...propertySharedValidInputs(),
          ...hasOngoingValidInputs(),
          propS.local("holdingPeriodSpanEditor"),
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

export const loanCompletionStatus = updateVarb(
  "completionStatus",
  cBasics({
    othersValid: [propS.onlyChild("loanBaseValue", "completionStatus")],
    nonNone: [propS.onlyChild("closingCostValue", "valueSourceName")],
    validInputs: [
      propS.local("interestRatePercentOngoingEditor"),
      propS.local("loanTermSpanEditor"),
      propS.onlyChild("closingCostValue", "valueDollarsEditor", [
        switchS.valueSourceIs("valueEditor"),
      ]),
    ],
  })
);

export const financingCompletionStatus = completionStatusVarb(
  updateOverride(
    [switchS.local("financingMethod", "", "cashOnly")],
    cBasics({ validInputs: [propS.local("financingMethod")] })
  ),
  updateOverride(
    [switchS.local("financingMethod", "useLoan")],
    cBasics({ othersValid: [propS.children("loan", "completionStatus")] })
  )
);

export const mgmtCompletionStatus = updateVarb(
  "completionStatus",
  cBasics({
    nonNone: [
      propS.onlyChild("mgmtBasePayValue", "valueSourceName"),
      propS.onlyChild("vacancyLossValue", "valueSourceName"),
    ],
    validInputs: [
      propS.onlyChild("mgmtBasePayValue", "valueDollarsOngoingEditor", [
        overrideSwitch(relVarbInfoS.local("valueSourceName"), "dollarsEditor"),
      ]),
      propS.onlyChild("mgmtBasePayValue", "valuePercentEditor", [
        overrideSwitch(
          relVarbInfoS.local("valueSourceName"),
          "percentOfRentEditor"
        ),
      ]),
      propS.onlyChild("vacancyLossValue", "valueDollarsOngoingEditor", [
        overrideSwitch(relVarbInfoS.local("valueSourceName"), "dollarsEditor"),
      ]),
      propS.onlyChild("vacancyLossValue", "valuePercentEditor", [
        overrideSwitch(
          relVarbInfoS.local("valueSourceName"),
          "percentOfRentEditor"
        ),
      ]),
    ],
  })
);
