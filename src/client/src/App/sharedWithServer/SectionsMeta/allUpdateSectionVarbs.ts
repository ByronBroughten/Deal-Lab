import { timeS } from "../utils/date";
import { dealRelVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/financingUpdateVarbs";
import { loanRelVarbs } from "./allUpdateSectionVarbs/loanUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/mgmtUpdateVarbs";
import { capExItemUpdateVarbs } from "./allUpdateSectionVarbs/ongoingItemUpdateVarbs";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/propertyUpdateVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";

import { mixedInfoS } from "./SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";
import {
  defaultSectionUpdateVarbs,
  updateSectionProp,
  UpdateSectionVarbs,
} from "./updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "./updateSectionVarbs/updateVarb";
import {
  updateBasics,
  UpdateBasics,
  updateBasicsS,
} from "./updateSectionVarbs/updateVarb/UpdateBasics";
import {
  completionStatusProps,
  updateFnPropS,
  updateFnPropsS,
} from "./updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitch,
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "./updateSectionVarbs/updateVarbs";
import { numObj } from "./values/StateValue/NumObj";

type GenericAllUpdateSections = {
  [SN in SectionName]: UpdateSectionVarbs<SN>;
};

function checkAllUpdateSections<US extends GenericAllUpdateSections>(
  allUpdateSections: US
): US {
  return allUpdateSections;
}

type DefaultRelSectionsVarbs = {
  [SN in SectionName]: UpdateSectionVarbs<SN>;
};

function makeAllDefaultUpdateSections() {
  return sectionNames.reduce((defaultUpdateSections, sectionName) => {
    defaultUpdateSections[sectionName] = defaultSectionUpdateVarbs(
      sectionName
    ) as any;
    return defaultUpdateSections;
  }, {} as DefaultRelSectionsVarbs);
}

function makeAllUpdateSections() {
  return checkAllUpdateSections({
    ...makeAllDefaultUpdateSections(),
    ...updateSectionProp("loan", loanRelVarbs()),
    ...updateSectionProp("mgmt", mgmtRelVarbs()),
    ...updateSectionProp("deal", dealRelVarbs()),
    ...updateSectionProp("financing", financingUpdateVarbs()),
    ...updateSectionProp("property", propertyUpdateVarbs()),
    ...updateSectionProp("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...updateVarbsS.ongoingInputNext("targetRent"),
    }),
    ...updateSectionProp("utilityValue", {
      valueSourceName: updateVarb("utilityValueSource", { initValue: "none" }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalMonthly")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalYearly")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExValue", {
      valueSourceName: updateVarb("capExValueSource", { initValue: "none" }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentMonthly")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalMonthly")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueLumpSumEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentYearly")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalYearly")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.loadFromLocal("valueLumpSumEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExList", {
      ...updateVarbsS.savableSection,
      ...updateVarbsS.group("total", "ongoing", "monthly", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueYearly"),
      }),
      itemOngoingSwitch: updateVarb("string", { initValue: "monthly" }),
    }),
    ...updateSectionProp("capExItem", capExItemUpdateVarbs()),
    ...updateSectionProp("maintenanceValue", {
      valueSourceName: updateVarb("maintainanceValueSource", {
        initValue: "none",
      }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueLumpSumEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
            updateOverride(
              [
                overrideSwitchS.local(
                  "valueSourceName",
                  ...["onePercentPrice", "sqft", "onePercentAndSqft"]
                ),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valueLumpSumEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "onePercentPrice")],
              updateBasicsS.loadByVarbPathName("onePercentPrice")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "sqft")],
              updateBasicsS.loadByVarbPathName("sqft")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "onePercentAndSqft")],
              updateBasicsS.loadByVarbPathName("onePercentPriceSqftAverage")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("repairValue", {
      valueSourceName: updateVarb("repairValueSource", { initValue: "none" }),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "zero")],
            updateBasicsS.zero
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "valueEditor")],
            updateBasicsS.loadFromLocal("valueLumpSumEditor")
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "listTotal")],
            updateBasicsS.loadFromChild("singleTimeList", "total")
          ),
        ],
      }),
    }),
    ...updateSectionProp("feUser", {
      authStatus: updateVarb("authStatus", { initValue: "guest" }),
      analyzerPlan: updateVarb("labSubscription", { initValue: "basicPlan" }),
      analyzerPlanExp: updateVarb("number", {
        initValue: timeS.hundredsOfYearsFromNow,
      }),
      userDataStatus: updateVarb("userDataStatus", {
        initValue: "notLoaded",
      }),
    }),
    ...updateSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: updateVarb("boolean", { initValue: false }),
    }),
    ...updateSectionProp("outputList", {
      itemValueSource: updateVarb("loadedVarbSource", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...updateSectionProp("singleTimeValueGroup", {
      total: updateVarbS.sumNums([
        updateFnPropS.children("singleTimeValue", "value"),
      ]),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("singleTimeList", {
      total: updateVarbS.sumNums([
        updateFnPropS.children("singleTimeItem", "value"),
      ]),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueLumpSumEditor: updateVarb("numObj"),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("fivePercentLoan")],
            updateBasics("emptyNumObj")
            // make loan update based on this switch
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("itemized")],
            updateBasicsS.loadFromChild(
              "singleTimeList",
              "total"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo(
              "valueLumpSumEditor"
            ) as UpdateBasics<"numObj">
          ),
        ],
      }),
    }),
    ...updateSectionProp("singleTimeValue", {
      displayName: updateVarb("stringObj", {
        updateFnName: "loadMainTextByVarbInfo",
        updateFnProps: { varbInfo: updateFnPropS.local("displayNameEditor") },
      }),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("itemized")],
            updateBasicsS.loadFromChild(
              "singleTimeList",
              "total"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo(
              "valueEditor"
            ) as UpdateBasics<"numObj">
          ),
        ],
      }),
      isItemized: updateVarb("boolean", {
        initValue: false,
      }),
      valueEditor: updateVarb("numObj"),
      valueSourceName: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("ongoingValue", {
      displayName: updateVarb("stringObj", {
        updateFnName: "loadMainTextByVarbInfo",
        updateFnProps: { varbInfo: updateFnPropS.local("displayNameEditor") },
      }),
      isItemized: updateVarb("boolean", {
        initValue: false,
      }),
      valueSourceName: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
      ...updateVarbsS.ongoingInputNext("value", {
        monthly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.valueSourceIs("itemized")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalMonthly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal(
                "valueEditor"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value") as UpdateBasics<"numObj">
            ),
          ],
        },
        yearly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.valueSourceIs("itemized")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalYearly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal(
                "valueEditor"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value") as UpdateBasics<"numObj">
            ),
          ],
        },
        editor: { updateFnName: "calcVarbs" },
      }),
    }),
    ...updateSectionProp("dealPage", {
      showOutputs: updateVarb("boolean", {
        initValue: false,
      }),
    }),
    ...updateSectionProp("ongoingValueGroup", {
      ...updateVarbsS.ongoingSumNums(
        "total",
        [updateFnPropS.children("ongoingValue", "value")],
        "monthly"
      ),
      value: updateVarb("numObj"),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemOngoingSwitch: updateVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("ongoingList", {
      ...updateVarbsS.ongoingSumNums(
        "total",
        [updateFnPropS.children("ongoingItem", "value")],
        "monthly"
      ),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      itemOngoingSwitch: updateVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("userVarbList", {
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      } as const),
    }),
    ...updateSectionProp("outputItem", {
      valueEntityInfo: updateVarb("inEntityValue"),
    }),
    ...updateSectionProp("virtualVarb", {
      valueEntityInfo: updateVarb("inEntityValue"),
      value: updateVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      displayName: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayName")],
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadStartAdornment")],
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadEndAdornment")],
      }),
    }),
    ...updateSectionProp("singleTimeItem", updateVarbsS.singleTimeItem()),
    ...updateSectionProp("ongoingItem", updateVarbsS.ongoingItem()),
    ...updateSectionProp("customVarb", updateVarbsS.basicVirtualVarb),
    ...updateSectionProp("userVarbItem", {
      ...updateVarbsS.listItemVirtualVarb,
      value: updateVarb("numObj", {
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...updateFnPropsS.localByVarbName(["valueSourceName", "valueEditor"]),
          conditionalValue: updateFnPropS.children(
            "conditionalRowList",
            "value"
          ),
        },
      }),
      valueSourceName: updateVarb("string", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("conditionalRowList", {
      value: updateVarb("numObj", {
        updateFnProps: updateFnPropsS.namedChildren("conditionalRow", {
          rowLevel: "level",
          rowType: "type",
          rowLeft: "left",
          rowOperator: "operator",
          rowRightValue: "rightValue",
          rowRightList: "rightList",
          rowThen: "then",
        }),
      }),
    }),
    ...updateSectionProp("conditionalRow", {
      type: updateVarb("string", { initValue: "if" }),
      operator: updateVarb("string", { initValue: "===" }),
    }),
    ...updateSectionProp("calculatedVarbs", {
      two: updateVarb("numObj", {
        ...updateBasics("two"),
      }),
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
      onePercentPricePlusSqft: updateVarb("numObj", {
        ...updateBasicsS.sumVarbPathName("onePercentPrice", "sqft"),
      }),
      onePercentPriceSqftAverage: updateVarb("numObj", {
        ...updateBasicsS.varbPathLeftRight(
          "simpleDivide",
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
            updateFnPropS.pathName("unitFocal", "targetRentOngoingEditor"),
            updateFnPropS.pathName("unitFocal", "numBedrooms"),
            updateFnPropS.pathName("capExCostFocal", "valueLumpSumEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("capExCostFocal", "valueSourceName"),
                "valueEditor"
              ),
            ]),
            updateFnPropS.pathName("repairCostFocal", "valueLumpSumEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("repairCostFocal", "valueSourceName"),
                "valueEditor"
              ),
            ]),
            updateFnPropS.pathName(
              "maintenanceCostFocal",
              "valueLumpSumEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb(
                    "maintenanceCostFocal",
                    "valueSourceName"
                  ),
                  "valueEditor"
                ),
              ]
            ),
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
          validInputs: [
            updateFnPropS.pathName("mgmtFocal", "basePayPercentEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "basePayUnitSwitch"),
                "percent"
              ),
            ]),
            updateFnPropS.pathName("mgmtFocal", "basePayDollarsEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "basePayUnitSwitch"),
                "dollars"
              ),
            ]),
            updateFnPropS.pathName("mgmtFocal", "vacancyLossPercentEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "vacancyLossUnitSwitch"),
                "percent"
              ),
            ]),
            updateFnPropS.pathName("mgmtFocal", "vacancyLossDollarsEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "vacancyLossUnitSwitch"),
                "dollars"
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
                validInputs: [
                  updateFnPropS.pathName("loanFocal", "loanBasePercentEditor", [
                    overrideSwitch(
                      relVarbInfoS.local("loanBaseUnitSwitch"),
                      "percent"
                    ),
                  ]),
                  updateFnPropS.pathName("loanFocal", "loanBaseDollarsEditor", [
                    overrideSwitch(
                      relVarbInfoS.local("loanBaseUnitSwitch"),
                      "dollars"
                    ),
                  ]),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "interestRatePercentOngoingEditor"
                  ),
                  updateFnPropS.pathName("loanFocal", "loanTermSpanEditor"),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "mortgageInsUpfrontEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "mortgageInsOngoingEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathName(
                    "closingCostFocal",
                    "valueLumpSumEditor",
                    [overrideSwitchS.valueSourceIs("valueEditor")]
                  ),
                ],
              })
            )
          ),
        ],
      }),
    }),
  });
}

export const allUpdateSections = makeAllUpdateSections();
export type AllUpdateSections = typeof allUpdateSections;

type GetUpdateSection<SN extends SectionName> = AllUpdateSections[SN];
export function getUpdateSection<SN extends SectionName>(
  sectionName: SN
): GetUpdateSection<SN> {
  return allUpdateSections[sectionName];
}

type GetUpdateVarb<
  SN extends SectionName,
  VN extends VarbName<SN>
> = GetUpdateSection<SN>[VN & keyof GetUpdateSection<SN>];
export function getUpdateVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): GetUpdateVarb<SN, VN> {
  return getUpdateSection(sectionName)[
    varbName as VN & keyof GetUpdateSection<SN>
  ];
}
