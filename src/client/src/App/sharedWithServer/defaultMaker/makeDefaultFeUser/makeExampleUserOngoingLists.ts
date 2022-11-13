import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { numObjNext } from "../../SectionsMeta/baseSectionsVarbs/baseValues/numObjNext";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { userVarbLifespans } from "./makeExampleUserVarbLists";

const capExBasicExamples = [
  [...userVarbLifespans.roof, numObj(8000)],
  [...userVarbLifespans.waterHeater, numObj(1200)], // unitCount * 1200
  [...userVarbLifespans.hvac, numObj(4000)], // unitCount * 4000
  [...userVarbLifespans.interiorPaint, numObj(5000)], // sqft * 3
  [...userVarbLifespans.windows, numObj(500)], // 5 + (bedroom count * 2)
  [...userVarbLifespans.siding, numObj(9000)], // 3 * sqft?
  [...userVarbLifespans.appliances, numObj(550 + 715)],
  [...userVarbLifespans.plumbing, numObj(10000)], // 5000 * unitCount
  [...userVarbLifespans.driveway, numObj(5000)],
  [...userVarbLifespans.laundry, numObj(1200)],
  [...userVarbLifespans.flooring, numObj(5000)], // sqft * 3
  [...userVarbLifespans.structure, numObj(10000)],
  [...userVarbLifespans.cabinetsCounters, numObj(8000)],
  [...userVarbLifespans.garageDoor, numObj(1000)],
  [...userVarbLifespans.landscaping, numObj(1000)],
] as const;

const capExAdvancedExamples = [
  [...userVarbLifespans.roof, numObj(8000)],
  [...userVarbLifespans.waterHeater, numObjNext("1200*", ["numUnits"])],
  [...userVarbLifespans.hvac, numObjNext("3500*", ["numUnits"])],
  [...userVarbLifespans.interiorPaint, numObjNext(["sqft"], "*3")],
  [...userVarbLifespans.windows, numObjNext("(5+2*", ["numBedrooms"]), ")*500"],
  [...userVarbLifespans.siding, numObjNext(["sqft"], "*4")],
  [...userVarbLifespans.appliances, numObjNext("550+715")],
  [...userVarbLifespans.plumbing, numObjNext("5000*", ["numUnits"])],
  [...userVarbLifespans.driveway, numObjNext(5000)],
  [...userVarbLifespans.laundry, numObjNext(1200)],
  [...userVarbLifespans.flooring, numObjNext(["sqft"], "*3")],
  [...userVarbLifespans.structure, numObjNext(10000)],
  [...userVarbLifespans.cabinetsCounters, numObjNext("4000*", ["numUnits"])],
  [...userVarbLifespans.garageDoor, numObjNext(1000)],
  [...userVarbLifespans.landscaping, numObjNext(1000)],
] as const;

const utilitiesBasic = [
  ["Water", numObj(100)],
  ["Garbage", numObj(75)],
  ["Energy", numObj(100)],
  ["LawnCare", numObj(20)],
] as const;

const utilitiesAdvanced = [
  ["Water", numObjNext("60*", ["numUnits"])],
  ["Garbage", numObjNext("40*", ["numUnits"])],
  ["Energy", numObjNext("120*", ["numUnits"])],
  ["LawnCare", numObjNext(20)],
] as const;

const repairsAdvanced = [
  ["Misc", numObjNext("(", ["price"], "*.005+", ["sqft"], ")/2")],
] as const;
// (price*.005+sqft)/2

export function makeExampleUserOngoingLists(): SectionPack<"ongoingList">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");

  const utilityValueSwitch = "labeledEquation";
  const basicUtilityList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: utilityValueSwitch,
      defaultOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utility Basic Examples"),
    },
  });
  for (const values of utilitiesBasic) {
    basicUtilityList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "monthly",
        valueSwitch: utilityValueSwitch,
        numObjEditor: values[1],
      },
    });
  }

  const advancedUtilityList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: utilityValueSwitch,
      defaultOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utility Examples"),
    },
  });
  for (const values of utilitiesAdvanced) {
    advancedUtilityList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "monthly",
        valueSwitch: utilityValueSwitch,
        numObjEditor: values[1],
      },
    });
  }

  const repairsValueSwitch = "labeledEquation";
  const ongoingRepairsList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: repairsValueSwitch,
      defaultOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("Ongoing Repair Budget Example"),
    },
  });
  for (const values of repairsAdvanced) {
    ongoingRepairsList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "yearly",
        valueSwitch: repairsValueSwitch,
        numObjEditor: values[1],
      },
    });
  }

  const capExExampleswitch = "labeledSpanOverCost";
  const basicCapExList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: capExExampleswitch,
      defaultOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("CapEx Basic Examples"),
    },
  });
  for (const values of capExBasicExamples) {
    basicCapExList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "yearly",
        lifespanSpanSwitch: "years",
        valueSwitch: capExExampleswitch,
        lifespanYears: numObj(values[1]),
        costToReplace: values[2],
      },
    });
  }
  const advancedCapExList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: capExExampleswitch,
      defaultOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("CapEx Examples"),
    },
  });
  for (const values of capExAdvancedExamples) {
    advancedCapExList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "yearly",
        lifespanSpanSwitch: "years",
        valueSwitch: capExExampleswitch,
        lifespanYears: numObj(values[1]),
        costToReplace: values[2],
      },
    });
  }
  return feUser.makeChildPackArr("ongoingListMain");
}
