import { timeS } from "../utils/date";
import { AnalyzerPlan } from "./baseSectionsVarbs";
import { numObj } from "./baseSectionsVarbs/baseValues/NumObj";
import { savableSectionVarbNames } from "./baseSectionsVarbs/specialVarbNames";
import { AuthStatus } from "./baseSectionsVarbsValues";
import { relAdorn } from "./relSectionVarbs/rel/relAdorn";
import { relVarb, relVarbS } from "./relSectionVarbs/rel/relVarb";
import {
  updateFnPropS,
  updateFnPropsS,
} from "./relSectionVarbs/rel/relVarb/UpdateFnProps";
import {
  defaultRelSectionVarbs,
  GeneralRelSectionVarbs,
  GenericRelSection,
  RelSection,
  relSectionProp,
} from "./relSectionVarbs/relSection";
import { RelVarbs, relVarbsS } from "./relSectionVarbs/relVarbs";
import { dealRelVarbs } from "./relSectionVarbs/relVarbs/dealRelVarbs";
import {
  financingRelVarbs,
  loanRelVarbs,
} from "./relSectionVarbs/relVarbs/financingRelVarbs";
import { mgmtRelVarbs } from "./relSectionVarbs/relVarbs/mgmtRelVarbs";
import { propertyRelVarbs } from "./relSectionVarbs/relVarbs/propertyRelVarbs";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { relVarbInfosS } from "./SectionInfo/RelVarbInfos";
import { SectionName, sectionNames } from "./SectionName";

type GenericRelSections = {
  [SN in SectionName]: GenericRelSection<SN>;
};

function relSectionsFilter<RS extends GenericRelSections>(relSections: RS): RS {
  return relSections;
}

type DefaultRelSectionsVarbs = {
  [SN in SectionName]: RelSection<SN, RelVarbs<SN>>;
};

const defaults = sectionNames.reduce((basicRelSections, sectionName) => {
  basicRelSections[sectionName] = defaultRelSectionVarbs(sectionName) as any;
  return basicRelSections;
}, {} as DefaultRelSectionsVarbs);

export function makeRelSections() {
  return relSectionsFilter({
    ...defaults,
    ...relSectionProp("feUser", {
      authStatus: relVarb("string", {
        initValue: "guest" as AuthStatus,
      }),
      analyzerPlan: relVarb("string", {
        displayName: "Api Access Status",
        initValue: "basicPlan" as AnalyzerPlan,
      }),
      analyzerPlanExp: relVarb("number", {
        initValue: timeS.hundredsOfYearsFromNow,
      }),
      userDataStatus: relVarb("string", {
        initValue: "notLoaded",
      }),
    }),
    ...relSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: relVarb("boolean", { initValue: false }),
    }),
    ...relSectionProp("outputList", {
      itemValueSwitch: relVarb("string", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...relSectionProp("singleTimeListGroup", {
      total: relVarbS.sumNums(
        "List group total",
        [updateFnPropS.children("singleTimeList", "total")],
        relAdorn.money
      ),
      itemValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ...relSectionProp("singleTimeList", {
      value: relVarbS.moneyObj("Expense", {
        updateFnName: "getNumObjOfSwitch",
        updateFnProps: {
          switch: updateFnPropS.local("valueSwitch"),
          total: updateFnPropS.local("total"),
          valueEditor: updateFnPropS.local("valueEditor"),
        },
      }),
      valueSwitch: relVarb("string", {
        initValue: "valueEditor",
      }),
      total: relVarbS.sumNums(
        relVarbInfoS.local("displayName"),
        [updateFnPropS.children("singleTimeItem", "value")],
        relAdorn.money
      ),
      itemValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ...relSectionProp("ongoingListGroup", {
      ...relVarbsS.ongoingSumNums(
        "total",
        "Ongoing List Group",
        [updateFnPropS.children("ongoingList", "total")],
        { switchInit: "monthly", shared: relAdorn.money }
      ),
      value: relVarb("numObj"),
      itemValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...relSectionProp("ongoingList", {
      ...relVarbsS.ongoingSumNums(
        "total",
        relVarbInfoS.local("displayName"),
        [updateFnPropS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
      valueMonthly: relVarbS.moneyObj("Expense", {
        updateFnName: "getNumObjOfSwitch",
        updateFnProps: {
          switch: updateFnPropS.local("valueSwitch"),
          total: updateFnPropS.local("totalYearly"),
          valueEditor: updateFnPropS.local("valueEditor"),
        },
      }),
      valueYearly: relVarbS.moneyObj("Expense", {
        updateFnName: "monthlyToYearly",
        updateFnProps: {
          num: updateFnPropS.local("valueMonthly"),
        },
        updateOverrides: [
          {
            switchInfo: relVarbInfoS.local("valueOngoingSwitch"),
            switchValue: "yearly",
            updateFnName: "getNumObjOfSwitch",
            updateFnProps: {
              switch: updateFnPropS.local("valueSwitch"),
              total: updateFnPropS.local("totalMonthly"),
              valueEditor: updateFnPropS.local("valueEditor"),
            },
          },
        ],
      }),
      // there is only one valueEditor
      // if the valueYearly switch is flipped,
      //

      valueSwitch: relVarb("string", {
        initValue: "valueEditor",
      }),
      itemValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...relSectionProp("userVarbList", {
      itemValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      } as const),
    }),
    ...relSectionProp("outputItem", {
      ...relVarbsS.listItemVirtualVarb,
      valueEditor: relVarbS.calcVarb("User Input"),
      valueSwitch: relVarb("string", {
        initValue: "loadedVarb",
      }),
      valueEntityInfo: relVarb("inEntityInfo"),
      value: relVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
        unit: "decimal",
      }),
    }),
    ...relSectionProp("singleTimeItem", relVarbsS.singleTimeItem()),
    ...relSectionProp("ongoingItem", relVarbsS.ongoingItem()),
    ...relSectionProp("customVarb", relVarbsS.basicVirtualVarb),
    ...relSectionProp("userVarbItem", {
      ...relVarbsS.listItemVirtualVarb,
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      value: relVarb("numObj", {
        displayName: relVarbInfoS.local("displayName"),
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...relVarbInfosS.localByVarbName(["valueSwitch", "valueEditor"]),
          conditionalValue: updateFnPropS.children(
            "conditionalRowList",
            "value"
          ),
        },
        unit: "decimal",
      }),
    }),
    ...relSectionProp("conditionalRowList", {
      value: relVarb("numObj", {
        updateFnProps: updateFnPropsS.namedChildren("conditionalRow", {
          rowLevel: "level",
          rowType: "type",
          rowLeft: "left",
          rowOperator: "operator",
          rowRightValue: "rightValue",
          rowRightList: "rightList",
          rowThen: "then",
        }),
        unit: "decimal",
      }),
    }),
    ...relSectionProp("conditionalRow", {
      type: relVarb("string", { initValue: "if" }),
      operator: relVarb("string", { initValue: "===" }),
    }),
    ...relSectionProp("deal", dealRelVarbs()),
    ...relSectionProp("financing", financingRelVarbs),
    ...relSectionProp("loan", loanRelVarbs()),
    ...relSectionProp("propertyGeneral", {
      ...relVarbsS.sumSection("property", propertyRelVarbs()),
      ...relVarbsS.sectionStrings(
        "property",
        propertyRelVarbs(),
        savableSectionVarbNames
      ),
    }),
    ...relSectionProp("property", propertyRelVarbs()),
    ...relSectionProp("unit", {
      one: relVarbS.numObj("Unit", {
        updateFnName: "one",
        initNumber: 1,
      }),
      numBedrooms: relVarbS.calcVarb("Bedrooms"),
      ...relVarbsS.timeMoneyInput("targetRent", "Rent"),
    }),
    ...relSectionProp("mgmtGeneral", {
      ...relVarbsS.sumSection("mgmt", { ...mgmtRelVarbs() }),
      ...relVarbsS.sectionStrings(
        "mgmt",
        { ...mgmtRelVarbs() },
        savableSectionVarbNames
      ),
    }),
    ...relSectionProp("mgmt", mgmtRelVarbs()),
  });
}

export const relSections = makeRelSections();
export type RelSections = typeof relSections;
type GeneralRelSections = {
  [SN in SectionName]: GeneralRelSectionVarbs;
};

const _testRelSections = <RS extends GeneralRelSections>(_: RS): void =>
  undefined;
_testRelSections(relSections);
