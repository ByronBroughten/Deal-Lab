import { timeS } from "../utils/date";
import { AnalyzerPlan } from "./allBaseSectionVarbs";
import { numObj } from "./allBaseSectionVarbs/baseValues/NumObj";
import { dealRelVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/financingUpdateVarbs";
import { loanRelVarbs } from "./allUpdateSectionVarbs/loanUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/mgmtUpdateVarbs";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/propertyUpdateVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { AuthStatus } from "./baseSectionsVarbsValues";
import { mixedInfoS } from "./sectionChildrenDerived/MixedSectionInfo";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";
import {
  defaultSectionUpdateVarbs,
  updateSectionProp,
  UpdateSectionVarbs,
} from "./updateSectionVarbs/updateSectionVarbs";
import { relVarbS, updateVarb } from "./updateSectionVarbs/updateVarb";
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
} from "./updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "./updateSectionVarbs/updateVarbs";

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
      one: updateVarb("numObj", {
        updateFnName: "one",
        initValue: numObj(1),
      }),
      numBedrooms: updateVarb("numObj"),
      ...updateVarbsS.ongoingInputNext("targetRent"),
    }),
    ...updateSectionProp("feUser", {
      authStatus: updateVarb("string", {
        initValue: "guest" as AuthStatus,
      }),
      analyzerPlan: updateVarb("string", {
        initValue: "basicPlan" as AnalyzerPlan,
      }),
      analyzerPlanExp: updateVarb("number", {
        initValue: timeS.hundredsOfYearsFromNow,
      }),
      userDataStatus: updateVarb("string", {
        initValue: "notLoaded",
      }),
    }),
    ...updateSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: updateVarb("boolean", { initValue: false }),
    }),
    ...updateSectionProp("outputList", {
      itemValueSwitch: updateVarb("string", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...updateSectionProp("singleTimeValueGroup", {
      total: relVarbS.sumNums([
        updateFnPropS.children("singleTimeValue", "value"),
      ]),
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ...updateSectionProp("singleTimeList", {
      total: relVarbS.sumNums([
        updateFnPropS.children("singleTimeItem", "value"),
      ]),
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
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
            [overrideSwitchS.local("isItemized", true)],
            updateBasicsS.loadFromChild(
              "singleTimeList",
              "total"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadFromLocal("valueEditor") as UpdateBasics<"numObj">
          ),
        ],
      }),
      isItemized: updateVarb("boolean", {
        initValue: false,
      }),
      valueEditor: updateVarb("numObj"),
      valueSourceSwitch: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
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
      valueSourceSwitch: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
      }),
      ...updateVarbsS.ongoingInputNext("value", {
        monthly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("isItemized", true)],
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
              [overrideSwitchS.local("isItemized", true)],
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
    ...updateSectionProp("ongoingValueGroup", {
      ...updateVarbsS.ongoingSumNums(
        "total",
        [updateFnPropS.children("ongoingValue", "value")],
        "monthly"
      ),
      value: updateVarb("numObj"),
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
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
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
      }),
      itemOngoingSwitch: updateVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("userVarbList", {
      itemValueSwitch: updateVarb("string", {
        initValue: "labeledEquation",
      } as const),
    }),
    ...updateSectionProp("outputItem", {
      ...updateVarbsS.listItemVirtualVarb,
      valueEditor: updateVarb("numObj"),
      valueSourceSwitch: updateVarb("string", {
        initValue: "loadedVarb",
      }),
      valueEntityInfo: updateVarb("inEntityInfo"),
      value: updateVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
        calculateRound: 5,
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
          ...updateFnPropsS.localByVarbName([
            "valueSourceSwitch",
            "valueEditor",
          ]),
          conditionalValue: updateFnPropS.children(
            "conditionalRowList",
            "value"
          ),
        },
      }),
      valueSourceSwitch: updateVarb("string", {
        initValue: "labeledEquation",
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
      onePercentPrice: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "onePercent",
          updateFnPropS.pathName("propertyFocal", "price")
        ),
      }),
      twoPercentPrice: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "twoPercent",
          updateFnPropS.pathName("propertyFocal", "price")
        ),
      }),
      dealCompletionStatus: updateVarb("string", {
        initValue: "allEmpty",
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          othersValid: [
            updateFnPropS.pathNameNext(
              "calculatedVarbsFocal",
              "propertyCompletionStatus"
            ),
            updateFnPropS.pathNameNext(
              "calculatedVarbsFocal",
              "financingCompletionStatus"
            ),
            updateFnPropS.pathNameNext(
              "calculatedVarbsFocal",
              "mgmtCompletionStatus"
            ),
          ],
        }),
      }),
      propertyCompletionStatus: updateVarb("string", {
        initValue: "allEmpty",
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          nonZeros: [updateFnPropS.pathName("propertyFocal", "numUnits")],
          validInputs: [
            ...updateFnPropsS.varbPathArr("price", "sqft"),
            updateFnPropS.pathName("propertyFocal", "taxesOngoingEditor"),
            updateFnPropS.pathName("propertyFocal", "homeInsOngoingEditor"),
            updateFnPropS.pathName("unitFocal", "targetRentOngoingEditor"),
            updateFnPropS.pathName("unitFocal", "numBedrooms"),
            updateFnPropS.pathNameNext("capExCostFocal", "valueEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("capExCostFocal", "isItemized"),
                false
              ),
            ]),
            updateFnPropS.pathNameNext("maintenanceCostFocal", "valueEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("maintenanceCostFocal", "isItemized"),
                false
              ),
            ]),
            updateFnPropS.pathNameNext("utilityCostFocal", "valueEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("utilityCostFocal", "isItemized"),
                false
              ),
            ]),
            updateFnPropS.pathNameNext("repairCostFocal", "valueEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("repairCostFocal", "isItemized"),
                false
              ),
            ]),
          ],
        }),
      }),
      mgmtCompletionStatus: updateVarb("string", {
        initValue: "allEmpty",
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          validInputs: [
            updateFnPropS.pathNameNext("mgmtFocal", "basePayPercentEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "basePayUnitSwitch"),
                "percent"
              ),
            ]),
            updateFnPropS.pathNameNext("mgmtFocal", "basePayDollarsEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtFocal", "basePayUnitSwitch"),
                "dollars"
              ),
            ]),
            updateFnPropS.pathNameNext(
              "mgmtFocal",
              "vacancyLossPercentEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb("mgmtFocal", "vacancyLossUnitSwitch"),
                  "percent"
                ),
              ]
            ),
            updateFnPropS.pathNameNext(
              "mgmtFocal",
              "vacancyLossDollarsEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb("mgmtFocal", "vacancyLossUnitSwitch"),
                  "dollars"
                ),
              ]
            ),
          ],
        }),
      }),
      financingCompletionStatus: updateVarb("string", {
        initValue: "allEmpty",
        updateFnName: "throwIfReached",
        updateOverrides: [
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
                  updateFnPropS.pathNameNext(
                    "loanFocal",
                    "loanBasePercentEditor",
                    [
                      overrideSwitch(
                        relVarbInfoS.local("loanBaseUnitSwitch"),
                        "percent"
                      ),
                    ]
                  ),
                  updateFnPropS.pathNameNext(
                    "loanFocal",
                    "loanBaseDollarsEditor",
                    [
                      overrideSwitch(
                        relVarbInfoS.local("loanBaseUnitSwitch"),
                        "dollars"
                      ),
                    ]
                  ),
                  updateFnPropS.pathNameNext(
                    "loanFocal",
                    "interestRatePercentOngoingEditor"
                  ),
                  updateFnPropS.pathNameNext("loanFocal", "loanTermSpanEditor"),
                  updateFnPropS.pathNameNext(
                    "loanFocal",
                    "mortgageInsUpfrontEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathNameNext(
                    "loanFocal",
                    "mortgageInsOngoingEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathNameNext(
                    "closingCostFocal",
                    "valueEditor",
                    [
                      overrideSwitch(
                        mixedInfoS.pathNameVarb(
                          "closingCostFocal",
                          "isItemized"
                        ),
                        false
                      ),
                    ]
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