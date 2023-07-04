import { timeS } from "../utils/timeS";
import { calculatedUpdateVarbs } from "./allUpdateSectionVarbs/calculatedUpdateVarbs";
import { costOverrunUpdateVarbs } from "./allUpdateSectionVarbs/costOverrunUpdateVarbs";
import { dealUpdateVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
import { dollarsOrListUpdateVarbs } from "./allUpdateSectionVarbs/dollarsOrListUpdateVarb";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/financingUpdateVarbs";
import { loanBaseUpdateVarbs } from "./allUpdateSectionVarbs/loanBaseUpdateVarbs";
import { loanUpdateVarbs } from "./allUpdateSectionVarbs/loanUpdateVarbs";
import { loanValueUpdateVarbs } from "./allUpdateSectionVarbs/loanValueUpdateVarbs";
import { mgmtBasePayValueVarbs } from "./allUpdateSectionVarbs/mgmtBasePayUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/mgmtUpdateVarbs";
import {
  capExItemUpdateVarbs,
  ongoingItemUpdateVarbs,
} from "./allUpdateSectionVarbs/ongoingItemUpdateVarbs";
import {
  holdingValueUpdateVarb,
  ongoingValueUpdateVarb,
} from "./allUpdateSectionVarbs/ongoingValueUpdateVarb";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/propertyUpdateVarbs";
import { sellingCostUpdateVarbs } from "./allUpdateSectionVarbs/sellingCostUpdateVarbs";
import { vacancyLossUpdateVarbs } from "./allUpdateSectionVarbs/vacancyLossUpdateVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { mixedInfoS } from "./SectionInfo/MixedSectionInfo";
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
  updateFnPropS,
  updateFnPropsS,
} from "./updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  valueSourceNumObj,
  valueSourceOverrides,
} from "./updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "./updateSectionVarbs/updateVarbs";
import { numObj } from "./values/StateValue/NumObj";

const propS = updateFnPropS;
const propsS = updateFnPropsS;
const varbsS = updateVarbsS;
const switchS = overrideSwitchS;
const basics = updateBasicsS;
const varb = updateVarb;

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

const prop = updateSectionProp;

function makeAllUpdateSections() {
  return checkAllUpdateSections({
    ...makeAllDefaultUpdateSections(),
    ...prop("sessionStore", {
      archivedAreLoaded: varb("boolean", {
        initValue: false,
      }),
      showArchivedDeals: varb("boolean", {
        initValue: false,
      }),
    }),
    ...prop("loan", loanUpdateVarbs()),
    ...prop("loanBaseValue", loanBaseUpdateVarbs()),
    ...prop("loanBaseExtra", {
      hasLoanExtra: varb("boolean", { initValue: false }),
      valueSourceName: varb("dollarsListOrZero", {
        initValue: "valueDollarsEditor",
      }),
      valueDollarsEditor: varb("numObj"),
      valueDollars: varb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride([switchS.localIsFalse("hasLoanExtra")], basics.zero),
          ...valueSourceOverrides("dollarsOrList", {
            valueDollarsEditor: basics.loadFromLocal("valueDollarsEditor"),
            listTotal: basics.loadFromChild("onetimeList", "total"),
          }),
        ],
      }),
    }),
    ...prop("customLoanBase", {
      valueSourceName: varb("dollarsOrList", {
        initValue: "valueDollarsEditor",
      }),
      valueDollars: valueSourceNumObj("dollarsOrList", {
        valueDollarsEditor: basics.loadFromLocal("valueDollarsEditor"),
        listTotal: basics.loadFromChild("onetimeList", "total"),
      }),
      valueDollarsEditor: varb("numObj"),
    }),
    ...prop(
      "purchaseLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("purchasePrice"))
    ),
    ...prop(
      "repairLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("rehabCost"))
    ),
    ...prop(
      "arvLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("afterRepairValue"))
    ),
    ...prop("sellingCostValue", sellingCostUpdateVarbs()),
    ...prop("mgmt", mgmtRelVarbs()),
    ...prop("vacancyLossValue", vacancyLossUpdateVarbs()),
    ...prop("mgmtBasePayValue", mgmtBasePayValueVarbs()),
    ...prop("deal", dealUpdateVarbs()),
    ...prop("financing", financingUpdateVarbs()),
    ...prop("property", propertyUpdateVarbs()),
    ...prop("costOverrunValue", costOverrunUpdateVarbs()),
    ...prop("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...varbsS.periodicInput("targetRent"),
    }),
    ...prop("taxesHolding", holdingValueUpdateVarb()),
    ...prop("homeInsHolding", holdingValueUpdateVarb()),
    ...prop("taxesOngoing", ongoingValueUpdateVarb("taxesHolding")),
    ...prop("homeInsOngoing", ongoingValueUpdateVarb("homeInsHolding")),
    ...prop("utilityValue", {
      valueSourceName: updateVarb("utilityValueSource", { initValue: "none" }),
      ...varbsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverrideS.activeYearlyToMonthly("valueDollars"),
            ...valueSourceOverrides("utilityValueSource", {
              none: updateBasics("emptyNumObj"),
              zero: updateBasicsS.zero,
              sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(
                "utilitiesOngoingMonthly"
              ),
              threeHundredPerUnit: updateBasics("threeHundredPerUnit"),
              valueDollarsEditor: updateBasicsS.loadFromLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadFromChild(
                "ongoingList",
                "totalMonthly"
              ),
            }),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverrideS.activeMonthlyToYearly("valueDollars"),
            ...valueSourceOverrides("utilityValueSource", {
              none: updateBasics("emptyNumObj"),
              zero: updateBasicsS.zero,
              sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(
                "utilitiesOngoingYearly"
              ),
              threeHundredPerUnit: updateBasics(
                "threeHundredPerUnitTimesTwelve"
              ),
              valueDollarsEditor: updateBasicsS.loadFromLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadFromChild(
                "ongoingList",
                "totalYearly"
              ),
            }),
          ],
        },
      }),
    }),
    ...prop("capExValue", {
      valueSourceName: updateVarb("capExValueSource", { initValue: "none" }),
      ...varbsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentMonthly")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalMonthly")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.switchIsActive("valueDollars", "periodic", "yearly"),
              ],
              updateBasicsS.yearlyToMonthly("valueDollars")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentYearly")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalYearly")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.switchIsActive("valueDollars", "periodic", "yearly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.monthlyToYearly("valueDollars")
            ),
          ],
        },
      }),
    }),
    ...prop("capExList", {
      ...varbsS.savableSection,
      ...varbsS.group("total", "periodic", "monthly", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueYearly"),
      }),
      itemPeriodicSwitch: updateVarb("ongoingSwitch", { initValue: "monthly" }),
    }),
    ...prop("capExItem", capExItemUpdateVarbs()),
    ...prop("maintenanceValue", {
      valueSourceName: updateVarb("maintainanceValueSource", {
        initValue: "none",
      }),
      ...varbsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.yearlyIsActive("valueDollars"),
              ],
              updateBasicsS.yearlyToMonthly("valueDollars")
            ),
            updateOverride(
              [
                switchS.local(
                  "valueSourceName",
                  "onePercentArv",
                  "sqft",
                  "onePercentArvAndSqft"
                ),
              ],
              updateBasicsS.yearlyToMonthly("valueDollars")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.yearlyIsActive("valueDollars"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                switchS.monthlyIsActive("valueDollars"),
              ],
              updateBasicsS.monthlyToYearly("valueDollars")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "onePercentArv")],
              updateBasicsS.loadByVarbPathName("onePercentArv")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "sqft")],
              updateBasicsS.loadByVarbPathName("sqft")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "onePercentArvAndSqft")],
              updateBasicsS.loadByVarbPathName("onePercentArvSqftAverage")
            ),
          ],
        },
      }),
    }),
    ...prop("repairValue", {
      valueSourceName: updateVarb("repairValueSource", { initValue: "none" }),
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.local("valueSourceName", "none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [switchS.local("valueSourceName", "zero")],
            updateBasicsS.zero
          ),
          updateOverride(
            [switchS.local("valueSourceName", "valueDollarsEditor")],
            updateBasicsS.loadFromLocal("valueDollarsEditor")
          ),
          updateOverride(
            [switchS.local("valueSourceName", "listTotal")],
            updateBasicsS.loadFromChild("onetimeList", "total")
          ),
        ],
      }),
    }),
    ...prop("feStore", {
      authStatus: updateVarb("authStatus", { initValue: "guest" }),
      labSubscription: updateVarb("labSubscription", {
        initValue: "basicPlan",
      }),
      labSubscriptionExp: updateVarb("number", {
        initValue: timeS.hundredsOfYearsFromNow,
      }),
      userDataStatus: updateVarb("userDataStatus", {
        initValue: "notLoaded",
      }),
    }),
    ...prop("userInfoPrivate", {
      guestSectionsAreLoaded: updateVarb("boolean", { initValue: false }),
    }),
    ...prop("outputList", {
      itemValueSource: updateVarb("loadedVarbSource", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...prop("onetimeList", {
      total: updateVarbS.sumNums([propS.children("onetimeItem", "value")]),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...prop("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: valueSourceOverrides("closingCostValueSource", {
          none: updateBasics("emptyNumObj"),
          fivePercentLoan: updateBasics("emptyNumObj"),
          listTotal: updateBasicsS.loadFromChild("onetimeList", "total"),
          valueDollarsEditor:
            updateBasicsS.loadSolvableTextByVarbInfo("valueDollarsEditor"),
        }),
      }),
    }),
    ...prop("onetimeValue", {
      ...varbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            updateBasicsS.loadFromChild(
              "onetimeList",
              "total"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [switchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo(
              "valueEditor"
            ) as UpdateBasics<"numObj">
          ),
        ],
      }),
      valueEditor: updateVarb("numObj"),
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...prop("ongoingValue", {
      ...varbsS.displayNameAndEditor,
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
      ...varbsS.periodicInput("value", {
        monthly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [switchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [switchS.valueSourceIs("listTotal")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalMonthly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                switchS.valueSourceIs("valueEditor"),
                switchS.monthlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valuePeriodicEditor")
            ),
            updateOverride(
              [
                switchS.valueSourceIs("valueEditor"),
                switchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [switchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [switchS.valueSourceIs("listTotal")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalYearly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                switchS.valueSourceIs("valueEditor"),
                switchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valuePeriodicEditor")
            ),
            updateOverride(
              [
                switchS.valueSourceIs("valueEditor"),
                switchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
          ],
        },
        editor: { updateFnName: "calcVarbs" },
      }),
    }),
    ...prop("miscRevenueValue", dollarsOrListUpdateVarbs()),
    ...prop("miscOngoingCost", dollarsOrListUpdateVarbs()),
    ...prop("miscHoldingCost", dollarsOrListUpdateVarbs()),
    ...prop("miscOnetimeCost", {
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: valueSourceOverrides("dollarsOrList", {
          valueDollarsEditor: updateBasicsS.loadFromLocal("valueDollarsEditor"),
          listTotal: updateBasicsS.loadFromChild("onetimeList", "total"),
        }),
      }),
      valueDollarsEditor: updateVarb("numObj", {
        initValue: numObj(0),
      }),
    }),
    ...prop("calculatedVarbs", calculatedUpdateVarbs()),
    ...prop("outputSection", {
      showOutputs: updateVarb("boolean", {
        initValue: false,
      }),
    }),

    ...prop("ongoingList", {
      ...varbsS.ongoingSumNums(
        "total",
        [propS.children("ongoingItem", "value")],
        "monthly"
      ),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      itemPeriodicSwitch: updateVarb("ongoingSwitch", {
        initValue: "monthly",
      }),
    }),
    ...prop("numVarbList", {
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      } as const),
    }),
    ...prop("outputItem", {
      valueEntityInfo: updateVarb("inEntityValue"),
    }),
    ...prop("virtualVarb", {
      valueEntityInfo: updateVarb("inEntityValue"),
      value: updateVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: propS.local("valueEntityInfo"),
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
    ...prop("onetimeItem", {
      ...varbsS._typeUniformity,
      ...varbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.local("valueSourceName", "valueEditor")],
            updateBasicsS.loadFromLocalValueEditor()
          ),
        ],
      }),
      valueSourceName: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      valueEditor: updateVarb("numObj"),
    }),
    ...prop("ongoingItem", ongoingItemUpdateVarbs()),
    ...prop("numVarbItem", {
      ...varbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...propsS.localByVarbName(["valueSourceName", "valueEditor"]),
          conditionalValue: propS.children("conditionalRowList", "value"),
        },
      }),
      valueSourceName: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...prop("conditionalRowList", {
      value: updateVarb("numObj", {
        updateFnProps: propsS.namedChildren("conditionalRow", {
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
    ...prop("conditionalRow", {
      type: updateVarb("string", { initValue: "if" }),
      operator: updateVarb("string", { initValue: "===" }),
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
