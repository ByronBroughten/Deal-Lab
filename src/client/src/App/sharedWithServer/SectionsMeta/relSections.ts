import { SimpleSectionName, UserPlan } from "./baseSections";
import { relVarbInfoS } from "./childSectionsDerived/RelVarbInfo";
import { relVarb, relVarbS } from "./relSectionsUtils/rel/relVarb";
import {
  GeneralRelSection,
  GenericRelSection,
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
import { userVarbItemRelVarbs } from "./relSectionsUtils/relVarbs/userVarbItemRelVarbs";

type GenericRelSections = {
  [SN in SimpleSectionName]: GenericRelSection<SN>;
};

function relSectionsFilter<RS extends GenericRelSections>(relSections: RS): RS {
  return relSections;
}

const savableSectionStringVarbNames = [
  "displayName",
  "dateTimeFirstSaved",
  "dateTimeLastSaved",
] as const;

export function makeRelSections() {
  return relSectionsFilter({
    root: relSection("Root", { _typeUniformity: relVarb("string") }),
    omniParent: relSection("Parent of all", {
      _typeUniformity: relVarb("string"),
    }),
    main: relSection("main", { _typeUniformity: relVarb("string") }),
    feStore: relSection("feStore", { _typeUniformity: relVarb("string") }),
    dbStore: relSection("dbStore", { _typeUniformity: relVarb("string") }),
    userInfo: relSection(
      "User",
      {
        email: relVarb("string", { displayName: "Email" }),
        userName: relVarb("string", { displayName: "Name" }),
        timeJoined: relVarb("number", { displayName: "Time joined" }),
      },
      { dbIndexStoreName: "userInfo" }
    ),
    authInfo: relSection("Auth info", {
      authStatus: relVarb("string", {
        initValue: "user",
      }),
    }),
    authInfoPrivate: relSection("Auth info private", {
      userId: relVarb("string"),
    }),
    subscriptionInfo: relSection("Subscription info", {
      plan: relVarb("string", {
        displayName: "Api Access Status",
        initValue: "basicPlan" as UserPlan,
      }),
      planExp: relVarb("number", { initValue: 0 }),
    }),
    dbOnlyUserInfo: relSection(
      "dbOnlyUserInfo",
      relVarbsS.strings(["encryptedPassword", "emailAsSubmitted"] as const)
    ),
    stripeInfoPrivate: relSection("Stripe info", {
      customerId: relVarb("string"),
    }),
    stripeSubscription: relSection("Subscription", {
      subId: relVarb("string"),
      subStatus: relVarb("string"),
      priceIds: relVarb("stringArray"),
      currentPeriodEnd: relVarb("number"),
    }),
    login: relSection("Login form", {
      email: relVarb("string", { displayName: "Email" }),
      password: relVarb("string", { displayName: "Password" }),
    }),
    register: relSection("Register form", {
      email: relVarb("string", { displayName: "Email" }),
      userName: relVarb("string", { displayName: "Name" }),
      password: relVarb("string", { displayName: "Password" }),
    }),
    table: relSection("Table", { titleFilter: relVarb("string") }),
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
    outputList: relSection("Output List", relVarbsS.savableSection, {
      feFullIndexStoreName: "outputListMain",
      dbIndexStoreName: "outputListMain",
    }),
    singleTimeList: relSection("List", relVarbsS.singleTimeList(), {
      varbListItem: "singleTimeItem",
      feFullIndexStoreName: "singleTimeListMain",
      dbIndexStoreName: "singleTimeListMain",
    }),
    ongoingList: relSection("List", relVarbsS.ongoingList(), {
      varbListItem: "ongoingItem",
      feFullIndexStoreName: "ongoingListMain",
      dbIndexStoreName: "ongoingListMain",
    }),
    userVarbList: relSection(
      "Variable List",
      {
        ...relVarbsS.savableSection,
        defaultValueSwitch: relVarb("string", {
          initValue: "labeledEquation",
        } as const),
      },
      {
        feFullIndexStoreName: "userVarbListMain",
        dbIndexStoreName: "userVarbListMain",
        varbListItem: "userVarbItem",
      }
    ),

    outputItem: relSection("Output", {
      ...relVarbsS.basicVirtualVarb,
      valueEntityInfo: relVarb("inEntityInfo"),
      value: relVarb("numObj", {
        updateFnName: "loadedNumObj",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
      }),
    }),
    singleTimeItem: relSection("List Item", relVarbsS.singleTimeItem()),
    ongoingItem: relSection("List Item", relVarbsS.ongoingItem()),
    userVarbItem: relSection("User Variable", userVarbItemRelVarbs),
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

    deal: relSection("Deal", dealRelVarbs(), {
      feTableIndexStoreName: "dealMainTable",
      dbIndexStoreName: "dealMain",
    } as const),
    financing: relSection("Financing", financingRelVarbs),
    loan: relSection("Loan", loanRelVarbs(), {
      feTableIndexStoreName: "loanMainTable",
      dbIndexStoreName: "loanMain",
    }),
    propertyGeneral: relSection("Property", {
      ...relVarbsS.sumSection("property", propertyRelVarbs()),
      ...relVarbsS.sectionStrings(
        "property",
        propertyRelVarbs(),
        savableSectionStringVarbNames
      ),
    }),
    property: relSection("Property", propertyRelVarbs(), {
      feTableIndexStoreName: "propertyMainTable",
      dbIndexStoreName: "propertyMain",
    }),
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
        savableSectionStringVarbNames
      ),
    }),
    mgmt: relSection("Management", mgmtRelVarbs(), {
      feTableIndexStoreName: "mgmtMainTable",
      dbIndexStoreName: "mgmtMain",
    }),
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
