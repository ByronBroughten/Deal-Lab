import { mixedInfoS } from "../SectionInfo/MixedSectionInfo";
import { VarbName } from "../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import { timeS } from "../utils/timeS";
import { SectionName, sectionNames } from "./SectionName";
import { numObj } from "./StateValue/NumObj";
import { defaultCreateDealModeOf } from "./StateValue/unionValues";
import {
  UpdateSectionVarbs,
  defaultSectionUpdateVarbs,
  updateSectionProp,
  usvs,
} from "./allUpdateSectionVarbs/updateSectionVarbs";
import {
  updateVarb,
  updateVarbS,
  uvS,
} from "./allUpdateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasicsS,
} from "./allUpdateSectionVarbs/updateVarb/UpdateBasics";
import { upS, upsS } from "./allUpdateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "./allUpdateSectionVarbs/updateVarb/UpdateOverride";
import { osS } from "./allUpdateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { uosS } from "./allUpdateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS, uvsS } from "./allUpdateSectionVarbs/updateVarbs";
import { afterRepairValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/afterRepairValueUpdateVarbs";
import { calculatedUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/calculatedUpdateVarbs";
import { capExItemUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/capExItemUpdateVarbs";
import { capExValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/capExValueUpdateVarbs";
import { costOverrunUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/costOverrunUpdateVarbs";
import { dealUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/dealUpdateVarbs";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/financingUpdateVarbs";
import { loanBaseExtraUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/loanBaseExtraUpdateVarbs";
import { loanBaseUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/loanBaseUpdateVarbs";
import { loanUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/loanUpdateVarbs";
import { loanValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/loanValueUpdateVarbs";
import { maintenanceValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/maintenanceValueUpdateVarbs";
import { mgmtBasePayValueVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/mgmtBasePayUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/mgmtUpdateVarbs";
import { miscPeriodicCostUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/miscPeriodicCostUpdateVarbs";
import { taxesAndHomeInsValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/ongoingValueUpdateVarb";
import { periodicEditorUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/periodicEditorUpdateVarbs";
import { periodicItemUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/periodicItemUpdateVarbs";
import {
  prepaidDailyUpdateVarbs,
  prepaidPeriodicUpdateVarbs,
} from "./allUpdateSectionVarbs/updateVarbsBySection/prepaidUpdateVarbs";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/propertyUpdateVarbs";
import { repairValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/repairValueUpdateVarbs";
import { sellingCostUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/sellingCostUpdateVarbs";
import { timespanEditorUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/timespanEditorUpdateVarbs";
import { utilityValueUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/utilityValueUpdateVarbs";
import { vacancyLossUpdateVarbs } from "./allUpdateSectionVarbs/updateVarbsBySection/vacancyLossUpdateVarbs";

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
    root: usvs("root", {}),
    ...prop("sessionStore", {
      createDealOfMode: varb("dealMode", {
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
    loan: loanUpdateVarbs(),
    loanBaseValue: loanBaseUpdateVarbs(),
    loanBaseExtra: loanBaseExtraUpdateVarbs(),
    customLoanBase: usvs("customLoanBase", {
      valueSourceName: varb("dollarsOrList", {
        initValue: "valueDollarsEditor",
      }),
      valueDollars: uvS.vsNumObj("dollarsOrList", {
        valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
        listTotal: ubS.loadChild("onetimeList", "total"),
      }),
      valueDollarsEditor: uvS.input("numObj"),
    }),
    purchaseLoanValue: usvs(
      "purchaseLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("purchasePrice"))
    ),
    repairLoanValue: usvs(
      "repairLoanValue",
      loanValueUpdateVarbs(mixedInfoS.varbPathName("rehabCost"))
    ),
    arvLoanValue: loanValueUpdateVarbs(
      mixedInfoS.varbPathName("afterRepairValue")
    ),
    mgmt: mgmtRelVarbs(),
    vacancyLossValue: vacancyLossUpdateVarbs(),
    mgmtBasePayValue: mgmtBasePayValueVarbs(),
    deal: dealUpdateVarbs(),
    financing: financingUpdateVarbs(),

    property: propertyUpdateVarbs(),
    afterRepairValue: afterRepairValueUpdateVarbs(),
    sellingCostValue: sellingCostUpdateVarbs(),
    costOverrunValue: costOverrunUpdateVarbs(),
    unit: usvs("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...uvsS.childPeriodicEditor("targetRent", "targetRentEditor"),
    }),
    taxesValue: taxesAndHomeInsValueUpdateVarbs(),
    homeInsValue: taxesAndHomeInsValueUpdateVarbs(),
    utilityValue: utilityValueUpdateVarbs(),
    maintenanceValue: maintenanceValueUpdateVarbs(),
    capExValue: capExValueUpdateVarbs(),
    capExList: usvs("capExList", {
      ...uvsS.savableSection,
      ...uvsS.periodic2("total", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueDollarsMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueDollarsYearly"),
      }),
      itemPeriodicSwitch: updateVarb("periodic", { initValue: "monthly" }),
    }),
    capExItem: capExItemUpdateVarbs(),
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
    outputList: usvs("outputList", updateVarbsS.savableSection),
    onetimeList: usvs("onetimeList", {
      ...updateVarbsS.savableSection,
      total: updateVarbS.sumNums([upS.children("onetimeItem", "valueDollars")]),
      itemValueSource: updateVarb("valueDollarsEditor"),
    }),
    prepaidPeriodic: prepaidPeriodicUpdateVarbs(),
    prepaidDaily: prepaidDailyUpdateVarbs(),
    closingCostValue: usvs("closingCostValue", {
      valueSourceName: uvS.input("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: uvS.input("numObj"),
      valueDollars: uvS.vsNumObj("closingCostValueSource", {
        none: ubS.emptyNumObj,
        fivePercentLoan: ubS.emptyNumObj,
        listTotal: ubS.loadChild("onetimeList", "total"),
        valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
      }),
    }),
    // mortgageInsPeriodicValue: varbs({
    //   valueSourceName: baseVarb("mortgageInsPeriodic"),
    //   ...baseVarbsS.periodicDollarsInput("valueDollars"),
    //   ...baseVarbsS.periodicPercentInput("percentLoan"),
    // }),
    mortgageInsUpfrontValue: usvs("mortgageInsUpfrontValue", {
      valueSourceName: uvS.input("mortgageInsUpfrontSource", {
        initValue: "percentLoanEditor",
      }),
      valueDollarsEditor: uvS.input("numObj"),
      percentLoanEditor: uvS.input("numObj"),
      decimalOfLoan: uvS.decimalToPercent("percentLoanEditor"),
    }),
    mortgageInsPeriodicValue: usvs("mortgageInsPeriodicValue", {
      valueSourceName: updateVarb("mortgageInsPeriodic", {
        initValue: "valuePercentEditor",
      }),
      ...uvsS.childPeriodicEditor("valueDollars", "valueDollarsEditor"),
      ...uvsS.childPeriodicEditor("percentLoan", "valuePercentEditor"),
      ...uvsS.periodic2("decimalOfLoan", {
        monthly: ubS.equationSimple("percentToDecimal", "percentLoanMonthly"),
        yearly: ubS.equationSimple("percentToDecimal", "percentLoanYearly"),
      }),
    }),
    miscPeriodicValue: miscPeriodicCostUpdateVarbs(),
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
    calculatedVarbs: calculatedUpdateVarbs(),

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
      itemValueSource: updateVarb("valueDollarsEditor", {
        initValue: "valueDollarsEditor",
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
    periodicItem: periodicItemUpdateVarbs(),

    ...prop("numVarbItem", {
      ...uvsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...upsS.localByVarbName("valueSourceName", "valueEditor"),
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
