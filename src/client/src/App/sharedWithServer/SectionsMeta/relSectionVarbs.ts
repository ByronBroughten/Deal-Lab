import { timeS } from "../utils/date";
import { UserPlan } from "./baseSectionsVarbs";
import { numObj } from "./baseSectionsVarbs/baseValues/NumObj";
import { savableSectionVarbNames } from "./baseSectionsVarbs/specialVarbNames";
import { relVarbInfoS } from "./childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "./childSectionsDerived/RelVarbInfos";
import { relAdorn } from "./relSectionVarbs/rel/relAdorn";
import { relVarb, relVarbS } from "./relSectionVarbs/rel/relVarb";
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
    ...relSectionProp("authInfo", {
      authStatus: relVarb("string", {
        initValue: "user",
      }),
    }),
    ...relSectionProp("subscriptionInfo", {
      plan: relVarb("string", {
        displayName: "Api Access Status",
        initValue: "basicPlan" as UserPlan,
      }),
      planExp: relVarb("number", { initValue: timeS.hundredsOfYearsFromNow }),
    }),
    ...relSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: relVarb("boolean", { initValue: false }),
    }),
    ...relSectionProp("outputList", {
      defaultValueSwitch: relVarb("string", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...relSectionProp("singleTimeListGroup", {
      total: relVarbS.sumNums(
        "List group total",
        [relVarbInfoS.children("singleTimeList", "total")],
        relAdorn.money
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ...relSectionProp("singleTimeList", {
      total: relVarbS.sumNums(
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("singleTimeItem", "value")],
        relAdorn.money
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ...relSectionProp("ongoingListGroup", {
      ...relVarbsS.ongoingSumNums(
        "total",
        "Ongoing List Group",
        [relVarbInfoS.children("ongoingList", "total")],
        { switchInit: "monthly", shared: relAdorn.money }
      ),
      defaultValueSwitch: relVarb("string", {
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
        [relVarbInfoS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...relSectionProp("userVarbList", {
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      } as const),
    }),
    ...relSectionProp("outputItem", {
      ...relVarbsS.listItemVirtualVarb,
      numObjEditor: relVarbS.calcVarb("User Input"),
      valueSwitch: relVarb("string", {
        initValue: "loadedVarb",
      }),
      valueEntityInfo: relVarb("inEntityInfo"),
      value: relVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
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
        updateFnName: "userVarb",
        initValue: numObj(0),
        updateFnProps: {
          ...relVarbInfosS.localByVarbName(["valueSwitch", "numObjEditor"]),
          conditionalValue: relVarbInfoS.children(
            "conditionalRowList",
            "value"
          ),
        },
        unit: "decimal",
      }),
    }),
    ...relSectionProp("conditionalRowList", {
      value: relVarb("numObj", {
        updateFnProps: {
          ...relVarbInfosS.namedChildren("conditionalRow", {
            rowLevel: "level",
            rowType: "type",
            rowLeft: "left",
            rowOperator: "operator",
            rowRightValue: "rightValue",
            rowRightList: "rightList",
            rowThen: "then",
          }),
        },
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
      numBedrooms: relVarbS.calcVarb("BRs"),
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
