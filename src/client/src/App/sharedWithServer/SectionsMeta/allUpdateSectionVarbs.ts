import { timeS } from "../utils/timeS";
import { afterRepairValueUpdateVarbs } from "./allUpdateSectionVarbs/afterRepairValueUpdateVarbs";
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
import { periodicEditorUpdateVarbs } from "./allUpdateSectionVarbs/periodicEditorUpdateVarbs";
import {
  prepaidDailyUpdateVarbs,
  prepaidPeriodicUpdateVarbs,
} from "./allUpdateSectionVarbs/prepaidUpdateVarbs";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/propertyUpdateVarbs";
import { repairValueUpdateVarbs } from "./allUpdateSectionVarbs/repairValueUpdateVarbs";
import { sellingCostUpdateVarbs } from "./allUpdateSectionVarbs/sellingCostUpdateVarbs";
import { timespanEditorUpdateVarbs } from "./allUpdateSectionVarbs/timespanEditorUpdateVarbs";
import { vacancyLossUpdateVarbs } from "./allUpdateSectionVarbs/vacancyLossUpdateVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { mixedInfoS } from "./SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";
import {
  defaultSectionUpdateVarbs,
  updateSectionProp,
  UpdateSectionVarbs,
} from "./updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS, uvS } from "./updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
  updateBasicsS,
} from "./updateSectionVarbs/updateVarb/UpdateBasics";
import { upS, upsS } from "./updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  updateOverride,
  updateOverrideS,
} from "./updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "./updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "./updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS, uvsS } from "./updateSectionVarbs/updateVarbs";
import { numObj } from "./values/StateValue/NumObj";
import { defaultCreateDealModeOf } from "./values/StateValue/unionValues";

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
      CreateDealOfMode: varb("dealMode", {
        initValue: defaultCreateDealModeOf,
      }),
      compareDealTimeReady: varb("dateTime", { initValue: 0 }),
      compareDealStatus: varb("compareDealStatus", { initValue: "editing" }),
      archivedAreLoaded: varb("boolean", { initValue: false }),
      showArchivedDeals: varb("boolean", { initValue: false }),
      isStartingDealEdit: varb("string", { initValue: "" }),
      isCreatingDeal: varb("boolean", { initValue: false }),
    }),
    timespanEditor: timespanEditorUpdateVarbs(),
    periodicEditor: periodicEditorUpdateVarbs(),
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
          updateOverride([osS.localIsFalse("hasLoanExtra")], ubS.zero),
          ...uosS.valueSource("dollarsOrList", {
            valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
            listTotal: ubS.loadChild("onetimeList", "total"),
          }),
        ],
      }),
    }),
    ...prop("customLoanBase", {
      valueSourceName: varb("dollarsOrList", {
        initValue: "valueDollarsEditor",
      }),
      valueDollars: uvS.vsNumObj("dollarsOrList", {
        valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
        listTotal: ubS.loadChild("onetimeList", "total"),
      }),
      valueDollarsEditor: uvS.input("numObj"),
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

    property: propertyUpdateVarbs(),
    afterRepairValue: afterRepairValueUpdateVarbs(),

    ...prop("costOverrunValue", costOverrunUpdateVarbs()),
    ...prop("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...uvsS.periodicInput("targetRent"),
    }),
    ...prop("taxesValue", taxesAndHomeInsValueUpdateVarbs()),
    ...prop("homeInsValue", taxesAndHomeInsValueUpdateVarbs()),
    ...prop("utilityValue", {
      valueSourceName: updateVarb("utilityValueSource", { initValue: "none" }),
      ...uvsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverrideS.activeYearlyToMonthly("valueDollars"),
            ...uosS.valueSource("utilityValueSource", {
              none: updateBasics("emptyNumObj"),
              zero: updateBasicsS.zero,
              sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(
                "utilitiesOngoingMonthly"
              ),
              threeHundredPerUnit: updateBasicsS.loadByVarbPathName(
                "threeHundredPerUnit"
              ),
              valueDollarsPeriodicEditor: updateBasicsS.loadLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadChild(
                "periodicList",
                "totalMonthly"
              ),
            }),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverrideS.activeMonthlyToYearly("valueDollars"),
            ...uosS.valueSource("utilityValueSource", {
              none: updateBasics("emptyNumObj"),
              zero: updateBasicsS.zero,
              sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(
                "utilitiesOngoingYearly"
              ),
              threeHundredPerUnit: updateBasicsS.loadByVarbPathName(
                "threeHundredPerUnitTimesTwelve"
              ),
              valueDollarsPeriodicEditor: updateBasicsS.loadLocal(
                "valueDollarsPeriodicEditor"
              ),
              listTotal: updateBasicsS.loadChild("periodicList", "totalYearly"),
            }),
          ],
        },
      }),
    }),
    ...prop("capExValue", {
      valueSourceName: updateVarb("capExValueSource", { initValue: "none" }),
      ...uvsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [osS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [osS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentMonthly")
            ),
            updateOverride(
              [osS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadChild("capExList", "totalMonthly")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.switchIsActive("valueDollars", "periodic", "yearly"),
              ],
              updateBasicsS.yearlyToMonthly("valueDollars")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [osS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [osS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentYearly")
            ),
            updateOverride(
              [osS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadChild("capExList", "totalYearly")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.switchIsActive("valueDollars", "periodic", "yearly"),
              ],
              updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.monthlyToYearly("valueDollars")
            ),
          ],
        },
      }),
    }),
    ...prop("capExList", {
      ...uvsS.savableSection,
      ...uvsS.periodic2("total", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueDollarsMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueDollarsYearly"),
      }),
      itemPeriodicSwitch: updateVarb("periodic", { initValue: "monthly" }),
    }),
    ...prop("capExItem", capExItemUpdateVarbs()),
    ...prop("maintenanceValue", {
      valueSourceName: updateVarb("maintainanceValueSource", {
        initValue: "none",
      }),
      ...uvsS.group("valueDollars", "periodic", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [osS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.switchIsActive("valueDollars", "periodic", "monthly"),
              ],
              updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.yearlyIsActive("valueDollars"),
              ],
              updateBasicsS.yearlyToMonthly("valueDollars")
            ),
            updateOverride(
              [
                osS.local(
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
              [osS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.yearlyIsActive("valueDollars"),
              ],
              updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [
                osS.local("valueSourceName", "valueDollarsPeriodicEditor"),
                osS.monthlyIsActive("valueDollars"),
              ],
              updateBasicsS.monthlyToYearly("valueDollars")
            ),
            updateOverride(
              [osS.local("valueSourceName", "onePercentArv")],
              updateBasicsS.loadByVarbPathName("onePercentArv")
            ),
            updateOverride(
              [osS.local("valueSourceName", "sqft")],
              updateBasicsS.loadByVarbPathName("sqft")
            ),
            updateOverride(
              [osS.local("valueSourceName", "onePercentArvAndSqft")],
              updateBasicsS.loadByVarbPathName("onePercentArvSqftAverage")
            ),
          ],
        },
      }),
    }),
    repairValue: repairValueUpdateVarbs("listTotal"),
    delayedCostValue: repairValueUpdateVarbs("listTotal"),
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
      total: updateVarbS.sumNums([upS.children("onetimeItem", "valueDollars")]),
      itemValueSource: updateVarb("valueDollarsEditor"),
    }),
    prepaidPeriodic: prepaidPeriodicUpdateVarbs(),
    prepaidDaily: prepaidDailyUpdateVarbs(),
    ...prop("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: uosS.valueSource("closingCostValueSource", {
          none: updateBasics("emptyNumObj"),
          fivePercentLoan: updateBasics("emptyNumObj"),
          listTotal: updateBasicsS.loadChild("onetimeList", "total"),
          valueDollarsEditor:
            updateBasicsS.loadSolvableTextByVarbInfo("valueDollarsEditor"),
        }),
      }),
    }),
    // mortgageInsUpfrontValue: varbs({
    //   valueSourceName: baseVarb("mortgageInsUpfrontSource"),
    //   valueDollarsEditor: baseVarb("numObj", dollars),
    //   valueDollars: baseVarb("numObj", dollars),
    //   percentLoanEditor: baseVarb("numObj", dollars),
    // }),
    // mortgageInsPeriodicValue: varbs({
    //   valueSourceName: baseVarb("mortgageInsperiodic"),
    //   ...baseVarbsS.periodicDollarsInput("valueDollars"),
    //   ...baseVarbsS.periodicPercentInput("percentLoan"),
    // }),
    ...prop("mortgageInsUpfrontValue", {
      valueSourceName: updateVarb("mortgageInsUpfrontSource", {
        initValue: "percentLoanEditor",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      percentLoanEditor: updateVarb("numObj"),
      decimalOfLoan: updateVarb(
        "numObj",
        ubS.equationSimple("percentToDecimal", upS.local("percentLoanEditor"))
      ),
    }),
    ...prop("mortgageInsPeriodicValue", {
      valueSourceName: updateVarb("mortgageInsperiodic", {
        initValue: "percentLoanPeriodicEditor",
      }),
      ...updateVarbsS.group("percentLoan", "periodicInput", "yearly", {
        editor: { initValue: numObj(0) },
        monthly: uvS.vsNumObj(
          "periodic",
          {
            monthly: ubS.loadLocal("percentLoanPeriodicEditor"),
            yearly: ubS.yearlyToMonthly("percentLoan"),
          },
          { switchInfo: relVarbInfoS.local("percentLoanPeriodicSwitch") }
        ),
        yearly: uvS.vsNumObj(
          "periodic",
          {
            yearly: ubS.loadLocal("percentLoanPeriodicEditor"),
            monthly: ubS.monthlyToYearly("percentLoan"),
          },
          { switchInfo: relVarbInfoS.local("percentLoanPeriodicSwitch") }
        ),
      }),
      ...updateVarbsS.group("decimalOfLoan", "periodic", "yearly", {
        monthly: ubS.equationSimple(
          "percentToDecimal",
          upS.local("percentLoanMonthly")
        ),
        yearly: ubS.equationSimple(
          "percentToDecimal",
          upS.local("percentLoanYearly")
        ),
      }),
      ...updateVarbsS.group("valueDollars", "periodicInput", "monthly", {
        editor: { initValue: numObj(0) },
        monthly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [osS.local("valueDollarsPeriodicSwitch", "monthly")],
              ubS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [osS.local("valueDollarsPeriodicSwitch", "yearly")],
              ubS.yearlyToMonthly("valueDollars")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [osS.local("valueDollarsPeriodicSwitch", "yearly")],
              ubS.loadLocal("valueDollarsPeriodicEditor")
            ),
            updateOverride(
              [osS.local("valueDollarsPeriodicSwitch", "monthly")],
              ubS.monthlyToYearly("valueDollars")
            ),
          ],
        },
      }),
    }),
    ...prop("miscPeriodicValue", miscPeriodicCostUpdateVarbs()),
    ...prop("miscOnetimeValue", {
      valueSourceName: updateVarb("dollarsOrList", { initValue: "listTotal" }),
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: uosS.valueSource("dollarsOrList", {
          valueDollarsEditor: updateBasicsS.loadLocal("valueDollarsEditor"),
          listTotal: updateBasicsS.loadChild("onetimeList", "total"),
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
      ...uvsS.periodic2("total", {
        monthly: ubS.sumChildren("periodicItem", "valueDollarsMonthly"),
        yearly: ubS.sumChildren("periodicItem", "valueDollarsYearly"),
      }),
      itemValueSource: updateVarb("valueDollarsPeriodicEditor", {
        initValue: "valueDollarsPeriodicEditor",
      }),
      itemPeriodicSwitch: updateVarb("periodic", {
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
          varbInfo: upS.local("valueEntityInfo"),
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
      ...uvsS._typeUniformity,
      ...uvsS.displayNameAndEditor,
      valueSourceName: updateVarb("valueDollarsEditor"),
      valueDollarsEditor: updateVarb("numObj"),
      valueDollars: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [osS.local("valueSourceName", "valueDollarsEditor")],
            updateBasicsS.loadLocal("valueDollarsEditor")
          ),
        ],
      }),
    }),
    ...prop("periodicItem", ongoingItemUpdateVarbs()),
    ...prop("numVarbItem", {
      ...uvsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...upsS.localByVarbName(["valueSourceName", "valueEditor"]),
          conditionalValue: upS.children("conditionalRowList", "value"),
        },
      }),
      valueSourceName: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...prop("conditionalRowList", {
      value: updateVarb("numObj", {
        updateFnProps: upsS.namedChildren("conditionalRow", {
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
