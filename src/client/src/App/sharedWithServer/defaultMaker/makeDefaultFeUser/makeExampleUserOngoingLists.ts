import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { numObjNext } from "../../SectionsMeta/baseSectionsVarbs/baseValues/numObjNext";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { userVarbLifespans } from "./makeExampleUserVarbLists";

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
