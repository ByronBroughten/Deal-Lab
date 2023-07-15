import { timeS } from "../utils/timeS";
import { calculatedUpdateVarbs } from "./allUpdateSectionVarbs/calculatedUpdateVarbs";
import { costOverrunUpdateVarbs } from "./allUpdateSectionVarbs/costOverrunUpdateVarbs";
import { dealUpdateVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/financingUpdateVarbs";
import { loanBaseUpdateVarbs } from "./allUpdateSectionVarbs/loanBaseUpdateVarbs";
import { loanUpdateVarbs } from "./allUpdateSectionVarbs/loanUpdateVarbs";
import { loanValueUpdateVarbs } from "./allUpdateSectionVarbs/loanValueUpdateVarbs";
import { mgmtBasePayValueVarbs } from "./allUpdateSectionVarbs/mgmtBasePayUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/mgmtUpdateVarbs";
import { miscPeriodicCostUpdateVarbs } from "./allUpdateSectionVarbs/miscPeriodicCostUpdateVarbs";
import {
  capExItemUpdateVarbs,
  ongoingItemUpdateVarbs,
} from "./allUpdateSectionVarbs/ongoingItemUpdateVarbs";
import { taxesAndHomeInsValueUpdateVarbs } from "./allUpdateSectionVarbs/ongoingValueUpdateVarb";
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
      isEditingComparedDeals: varb("boolean", { initValue: false }),
      archivedAreLoaded: varb("boolean", { initValue: false }),
      showArchivedDeals: varb("boolean", { initValue: false }),
      isCreatingDeal: varb("boolean", { initValue: false }),
      isStartingDealEdit: varb("string", { initValue: "" }),
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
    ...prop("taxesValue", taxesAndHomeInsValueUpdateVarbs()),
    ...prop("homeInsValue", taxesAndHomeInsValueUpdateVarbs()),
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
              threeHundredPerUnit: updateBasicsS.loadByVarbPathName(
                "threeHundredPerUnit"
              ),
              valueDollarsPeriodicEditor: updateBasicsS.loadFromLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadFromChild(
                "periodicList",
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
              threeHundredPerUnit: updateBasicsS.loadByVarbPathName(
                "threeHundredPerUnitTimesTwelve"
              ),
              valueDollarsPeriodicEditor: updateBasicsS.loadFromLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadFromChild(
                "periodicList",
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
        monthly: updateBasicsS.sumChildren("capExItem", "valueDollarsMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueDollarsYearly"),
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
    ...prop("outputList", updateVarbsS.savableSection),
    ...prop("onetimeList", {
      total: updateVarbS.sumNums([
        propS.children("onetimeItem", "valueDollars"),
      ]),
      itemValueSource: updateVarb("valueDollarsEditor"),
    }),
    ...prop("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      valueDollars: updateVarb("numObj", {
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
    ...prop("miscPeriodicValue", miscPeriodicCostUpdateVarbs()),
    ...prop("miscOnetimeValue", {
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

    ...prop("periodicList", {
      ...varbsS.ongoingSumNums(
        "total",
        [propS.children("periodicItem", "valueDollars")],
        "monthly"
      ),
      itemValueSource: updateVarb("valueDollarsPeriodicEditor", {
        initValue: "valueDollarsPeriodicEditor",
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
      valueSourceName: updateVarb("valueDollarsEditor"),
      valueDollarsEditor: updateVarb("numObj"),
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.local("valueSourceName", "valueDollarsEditor")],
            updateBasicsS.loadFromLocal("valueDollarsEditor")
          ),
        ],
      }),
    }),
    ...prop("periodicItem", ongoingItemUpdateVarbs()),
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
