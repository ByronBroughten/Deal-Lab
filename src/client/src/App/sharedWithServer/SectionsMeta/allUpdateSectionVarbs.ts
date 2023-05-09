import { timeS } from "../utils/timeS";
import { basicOngoingValueVarbs } from "./allUpdateSectionVarbs/basicOngoingValue";
import { calculatedUpdateVarbs } from "./allUpdateSectionVarbs/calculatedUpdateVarbs";
import { costOverrunUpdateVarbs } from "./allUpdateSectionVarbs/costOverrunUpdateVarbs";
import { dealUpdateVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
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
import { valueSourceOverrides } from "./updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "./updateSectionVarbs/updateVarbs";
import { numObj } from "./values/StateValue/NumObj";

const propS = updateFnPropS;
const propsS = updateFnPropsS;
const varbsS = updateVarbsS;
const switchS = overrideSwitchS;

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
    ...updateSectionProp("loan", loanUpdateVarbs()),
    ...updateSectionProp("loanBaseValue", loanBaseUpdateVarbs()),
    ...updateSectionProp(
      "purchaseLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("purchasePrice"))
    ),
    ...updateSectionProp(
      "repairLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("rehabCost"))
    ),
    ...updateSectionProp(
      "arvLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("afterRepairValue"))
    ),
    ...updateSectionProp("sellingCostValue", sellingCostUpdateVarbs()),
    ...updateSectionProp("mgmt", mgmtRelVarbs()),
    ...updateSectionProp("vacancyLossValue", vacancyLossUpdateVarbs()),
    ...updateSectionProp("mgmtBasePayValue", mgmtBasePayValueVarbs()),
    ...updateSectionProp("deal", dealUpdateVarbs()),
    ...updateSectionProp("financing", financingUpdateVarbs()),
    ...updateSectionProp("property", propertyUpdateVarbs()),
    ...updateSectionProp("costOverrunValue", costOverrunUpdateVarbs()),
    ...updateSectionProp("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...varbsS.ongoingInputNext("targetRent"),
    }),
    ...updateSectionProp("utilityValue", {
      valueSourceName: updateVarb("utilityValueSource", { initValue: "none" }),
      ...varbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalMonthly")
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
              [switchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalYearly")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExValue", {
      valueSourceName: updateVarb("capExValueSource", { initValue: "none" }),
      ...varbsS.group("value", "ongoing", "monthly", {
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
                switchS.local("valueSourceName", "valueEditor"),
                switchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.yearlyToMonthly("value")
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
                switchS.local("valueSourceName", "valueEditor"),
                switchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExList", {
      ...varbsS.savableSection,
      ...varbsS.group("total", "ongoing", "monthly", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueYearly"),
      }),
      itemOngoingSwitch: updateVarb("ongoingSwitch", { initValue: "monthly" }),
    }),
    ...updateSectionProp("capExItem", capExItemUpdateVarbs()),
    ...updateSectionProp("maintenanceValue", {
      valueSourceName: updateVarb("maintainanceValueSource", {
        initValue: "none",
      }),
      ...varbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
            updateOverride(
              [
                switchS.local(
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
              [switchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                switchS.local("valueSourceName", "valueEditor"),
                switchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "onePercentPrice")],
              updateBasicsS.loadByVarbPathName("onePercentPrice")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "sqft")],
              updateBasicsS.loadByVarbPathName("sqft")
            ),
            updateOverride(
              [switchS.local("valueSourceName", "onePercentAndSqft")],
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
            [switchS.local("valueSourceName", "none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [switchS.local("valueSourceName", "zero")],
            updateBasicsS.zero
          ),
          updateOverride(
            [switchS.local("valueSourceName", "valueEditor")],
            updateBasicsS.loadFromLocal("valueDollarsEditor")
          ),
          updateOverride(
            [switchS.local("valueSourceName", "listTotal")],
            updateBasicsS.loadFromChild("onetimeList", "total")
          ),
        ],
      }),
    }),
    ...updateSectionProp("feStore", {
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
    ...updateSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: updateVarb("boolean", { initValue: false }),
    }),
    ...updateSectionProp("outputList", {
      itemValueSource: updateVarb("loadedVarbSource", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...updateSectionProp("onetimeList", {
      total: updateVarbS.sumNums([propS.children("singleTimeItem", "value")]),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [switchS.valueSourceIs("fivePercentLoan")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            updateBasicsS.loadFromChild("onetimeList", "total")
          ),
          updateOverride(
            [switchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo("valueDollarsEditor")
          ),
        ],
      }),
    }),
    ...updateSectionProp("singleTimeValue", {
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
    ...updateSectionProp("ongoingValue", {
      ...varbsS.displayNameAndEditor,
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
      ...varbsS.ongoingInputNext("value", {
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
              updateBasicsS.loadFromLocal("valueOngoingEditor")
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
              updateBasicsS.loadFromLocal("valueOngoingEditor")
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
    ...updateSectionProp("miscRevenueValue", basicOngoingValueVarbs()),
    ...updateSectionProp("miscOngoingCost", basicOngoingValueVarbs()),
    ...updateSectionProp("miscHoldingCost", basicOngoingValueVarbs()),
    ...updateSectionProp("miscOnetimeCost", {
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: valueSourceOverrides("dollarsOrList", {
          dollarsEditor: updateBasicsS.loadFromLocal("valueDollarsEditor"),
          listTotal: updateBasicsS.loadFromChild("onetimeList", "total"),
        }),
      }),
      valueDollarsEditor: updateVarb("numObj", {
        initValue: numObj(0),
      }),
    }),
    ...updateSectionProp("calculatedVarbs", calculatedUpdateVarbs()),
    ...updateSectionProp("outputSection", {
      showOutputs: updateVarb("boolean", {
        initValue: false,
      }),
    }),
    ...updateSectionProp("ongoingList", {
      ...varbsS.ongoingSumNums(
        "total",
        [propS.children("ongoingItem", "value")],
        "monthly"
      ),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      itemOngoingSwitch: updateVarb("ongoingSwitch", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("numVarbList", {
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
    ...updateSectionProp("singleTimeItem", {
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
    ...updateSectionProp("ongoingItem", ongoingItemUpdateVarbs()),
    ...updateSectionProp("numVarbItem", {
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
    ...updateSectionProp("conditionalRowList", {
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
    ...updateSectionProp("conditionalRow", {
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
