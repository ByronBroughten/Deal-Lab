import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { userVarbLifespans } from "./makeExampleUserVarbLists";

// const miscOngoingRepairs = "((Price*.005+sqft)/2)/12";

const capExExamples = [
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

const utilityExamples = [
  ["Water", 100], // (88/3) * bedroom count
  ["Garbage", 75], // (60/3) * bedroom count
  ["Energy", 100], //
  ["LawnCare", 20],
] as const;

export function makeExampleUserOngoingLists() {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const capExExampleswitch = "labeledSpanOverCost";
  const capExExampleList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: capExExampleswitch,
      defaultOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("CapEx Examples"),
    },
  });
  for (const values of capExExamples) {
    capExExampleList.addChild("ongoingItem", {
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

  const utilityValueSwitch = "labeledEquation";
  const utiltyExampleList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: utilityValueSwitch,
      defaultOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utility Examples"),
    },
  });
  for (const values of utilityExamples) {
    utiltyExampleList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "monthly",
        valueSwitch: utilityValueSwitch,
        numObjEditor: numObj(values[1]),
      },
    });
  }
  return feUser.makeChildPackArrs("ongoingListMain");
}
