import { timeS } from "../utils/date";
import { sectionVarbNames } from "./baseSectionsDerived/baseSectionTypes";
import { numObj } from "./baseSectionsUtils/baseValues/NumObj";
import {
  savableSectionVarbNames,
  SimpleSectionName,
  simpleSectionNames,
  UserPlan,
} from "./baseSectionsVarbs";
import { relVarbInfoS } from "./childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "./childSectionsDerived/RelVarbInfos";
import { relAdorn } from "./relSectionsUtils/rel/relAdorn";
import { relVarb, relVarbS } from "./relSectionsUtils/rel/relVarb";
import {
  GeneralRelSection,
  GenericRelSection,
  RelSection,
  relSection,
} from "./relSectionsUtils/relSection";
import { RelVarbs, relVarbsS } from "./relSectionsUtils/relVarbs";
import { dealRelVarbs } from "./relSectionsUtils/relVarbs/dealRelVarbs";
import {
  financingRelVarbs,
  loanRelVarbs,
} from "./relSectionsUtils/relVarbs/financingRelVarbs";
import { mgmtRelVarbs } from "./relSectionsUtils/relVarbs/mgmtRelVarbs";
import { propertyRelVarbs } from "./relSectionsUtils/relVarbs/propertyRelVarbs";

type GenericRelSections = {
  [SN in SimpleSectionName]: GenericRelSection<SN>;
};

function relSectionsFilter<RS extends GenericRelSections>(relSections: RS): RS {
  return relSections;
}

type BasicRelSection<SN extends SimpleSectionName> = RelSection<
  SN,
  "",
  RelVarbs<SN>
>;

type BasicRelSections = {
  [SN in SimpleSectionName]: BasicRelSection<SN>;
};

function makeBasicRelVarbs<SN extends SimpleSectionName>(sectionName: SN) {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((relVarbs, varbName) => {
    // get the varbType
    return relVarbs;
  }, {} as RelVarbs<SN>);
}
function makeBasicRelSection<SN extends SimpleSectionName>(
  sectionName: SN
): BasicRelSection<SN> {
  return relSection("", makeBasicRelVarbs(sectionName));
}
function makeBasicRelSections(): BasicRelSections {
  return simpleSectionNames.reduce((basicRelSections, sectionName) => {
    basicRelSections[sectionName] = makeBasicRelSection(sectionName) as any;
    return basicRelSections;
  }, {} as BasicRelSections);
}

// start with a place to identify the sectionNames
// sectionChildren comes next
// sectionTraits comes after sectionChildren
// sectionTraits should have the necessary displayNames

// baseSectionsVarbs should just have varbs and be called "baseSectionVarbs"
// each baseSectionVarb should be an object
// relSections should just have varbs and be called "relSectionVarbs"

export function makeRelSections() {
  return relSectionsFilter({
    root: relSection("Root", { _typeUniformity: relVarb("string") }),
    proxy: relSection("Proxy", { _typeUniformity: relVarb("string") }),
    displayNameItem: relSection("DisplayName", {
      displayName: relVarb("string"),
    }),
    displayNameList: relSection("DisplayName List", {
      searchFilter: relVarb("string"),
    }),
    omniParent: relSection("Parent of all", {
      _typeUniformity: relVarb("string"),
    }),
    main: relSection("Main", { _typeUniformity: relVarb("string") }),
    feUser: relSection("FE User", { _typeUniformity: relVarb("string") }),
    dbStore: relSection("dbStore", { _typeUniformity: relVarb("string") }),
    userInfo: relSection("User", {
      email: relVarb("string", { displayName: "Email" }),
      userName: relVarb("string", { displayName: "Name" }),
      timeJoined: relVarb("number", { displayName: "Time joined" }),
    }),
    authInfo: relSection("Auth info", {
      authStatus: relVarb("string", {
        initValue: "user",
      }),
    }),
    authInfoPrivate: relSection("Auth info private", {
      authId: relVarb("string"),
    }),
    subscriptionInfo: relSection("Subscription info", {
      plan: relVarb("string", {
        displayName: "Api Access Status",
        initValue: "basicPlan" as UserPlan,
      }),
      planExp: relVarb("number", { initValue: timeS.hundredsOfYearsFromNow }),
    }),
    userInfoPrivate: relSection("userInfoPrivate", {
      ...relVarbsS.strings(["encryptedPassword", "emailAsSubmitted"] as const),
      guestSectionsAreLoaded: relVarb("boolean", { initValue: false }),
    }),
    stripeInfoPrivate: relSection("Stripe info", {
      customerId: relVarb("string"),
    }),
    stripeSubscription: relSection("Subscription", {
      subId: relVarb("string"),
      status: relVarb("string"),
      priceIds: relVarb("stringArray"),
      currentPeriodEnd: relVarb("number"),
    }),
    compareTable: relSection("Table", { titleFilter: relVarb("string") }),
    tableRow: relSection("Row", {
      displayName: relVarb("string"),
      compareToggle: relVarb("boolean"),
    }),
    column: relSection("Column", {
      valueEntityInfo: relVarb("inEntityInfo"),
    }),
    cell: relSection("Cell", {
      valueEntityInfo: relVarb("inEntityInfo"),
      displayVarb: relVarb("string"),
    }),
    outputList: relSection("Output List", {
      ...relVarbsS.savableSection,
      defaultValueSwitch: relVarb("string", {
        initValue: "loadedVarb",
      } as const),
    }),
    singleTimeListGroup: relSection("List group", {
      total: relVarbS.sumNums(
        "List group total",
        [relVarbInfoS.children("singleTimeList", "total")],
        relAdorn.money
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    singleTimeList: relSection("List", {
      ...relVarbsS.savableSection,
      total: relVarbS.sumNums(
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("singleTimeItem", "value")],
        relAdorn.money
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    }),
    ongoingListGroup: relSection("List Group", {
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
    ongoingList: relSection("List", {
      ...relVarbsS.savableSection,
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
      ...relVarbsS.ongoingSumNums(
        "total",
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    }),
    userVarbList: relSection("Variable List", {
      ...relVarbsS.savableSection,
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      } as const),
    }),

    outputItem: relSection("Output", {
      ...relVarbsS.basicVirtualVarb,
      numObjEditor: relVarbS.calcVarb("User Input"),
      displayNameEditor: relVarbS.displayNameEditor,
      valueSwitch: relVarb("string"),
      valueEntityInfo: relVarb("inEntityInfo"),
      value: relVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
        unit: "decimal",
      }),
    }),
    singleTimeItem: relSection("List Item", relVarbsS.singleTimeItem()),
    ongoingItem: relSection("List Item", relVarbsS.ongoingItem()),
    customVarb: relSection("CustomVarb", {
      ...relVarbsS.basicVirtualVarb,
      valueEntityInfo: relVarb("inEntityInfo"),
      value: relVarb("numObj"),
    }),
    userVarbItem: relSection("User Variable", {
      ...relVarbsS.listItemVirtualVarb,
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      numObjEditor: relVarb("numObj"),
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
    conditionalRowList: relSection("Conditional Row List", {
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
    conditionalRow: relSection("Conditional Row", {
      level: relVarb("number"),
      type: relVarb("string", { initValue: "if" }),
      // if
      left: relVarb("numObj"),
      operator: relVarb("string", { initValue: "===" }),
      rightList: relVarb("stringArray"),
      rightValue: relVarb("numObj"),
      // then
      then: relVarb("numObj"),
    }),
    //     { type: "if", level: 0 },
    //     { type: "then", level: 0 },
    //     { type: "or else", level: 0 },

    deal: relSection("Deal", dealRelVarbs()),
    financing: relSection("Financing", financingRelVarbs),
    loan: relSection("Loan", loanRelVarbs()),
    propertyGeneral: relSection("Property", {
      ...relVarbsS.sumSection("property", propertyRelVarbs()),
      ...relVarbsS.sectionStrings(
        "property",
        propertyRelVarbs(),
        savableSectionVarbNames
      ),
    }),
    property: relSection("Property", propertyRelVarbs()),
    unit: relSection("Unit", {
      one: relVarbS.numObj("Unit", {
        updateFnName: "one",
        initNumber: 1,
      }),
      numBedrooms: relVarbS.calcVarb("BRs"),
      ...relVarbsS.timeMoneyInput("targetRent", "Rent"),
    } as RelVarbs<"unit">),
    mgmtGeneral: relSection("Management", {
      ...relVarbsS.sumSection("mgmt", { ...mgmtRelVarbs() }),
      ...relVarbsS.sectionStrings(
        "mgmt",
        { ...mgmtRelVarbs() },
        savableSectionVarbNames
      ),
    }),
    mgmt: relSection("Management", mgmtRelVarbs()),
  });
}

export const relSections = makeRelSections();
export type RelSections = typeof relSections;
type GeneralRelSections = {
  [SN in SimpleSectionName]: GeneralRelSection;
};

const _testRelSections = <RS extends GeneralRelSections>(_: RS): void =>
  undefined;
_testRelSections(relSections);
