import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { numObjNext } from "../../SectionsMeta/baseSectionsVarbs/baseValues/numObjNext";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { Obj } from "../../utils/Obj";
import {
  priceSqftMiscRepairHybrid,
  userVarbLifespans,
} from "./makeExampleOngoingListsProps";

type UserVarbLifespansMap = typeof userVarbLifespans;
type UserVarbLifespanArrs = UserVarbLifespansMap[keyof UserVarbLifespansMap][];
const userVarbLifespanArrs: UserVarbLifespanArrs = Obj.keys(
  userVarbLifespans
).map((key) => {
  return userVarbLifespans[key];
});

const lists = [
  ["Average lifespan examples", userVarbLifespanArrs],
  [
    "Common repair examples",
    [
      ["Swap toilet hardware", 30],
      ["Change deadbolt", 20],
      ["Add smoke detector", 15],
      ["Install outlet", 30],
    ],
  ],
  [
    "Replacement cost examples",
    [
      ["Vinyl plank per sqft", 3],
      ["Furnace", 3500],
      ["Water heater", 1200],
      ["Window", 500],
      ["Stove", 600],
      ["Refrigerator", 800],
      ["Laundry", 1200],
      ["Roof", 8000],
    ],
  ],
] as const;

const miscRepairList = [
  "Misc Repair Estimate Methods",
  [
    ["10% of Rent", numObjNext(["targetRentMonthly"], "* .10")],
    ["1% of Price", numObjNext(["price"], "* .01")],
    ["Square Feet", numObjNext(["sqft"])],
    ["Price/Sqft Hybrid", priceSqftMiscRepairHybrid],
  ],
] as const;

export function makeExampleUserVarbLists(): SectionPack<"userVarbList">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  for (const listArr of lists) {
    const varbList = feUser.addAndGetChild("userVarbListMain", {
      dbVarbs: { displayName: stringObj(listArr[0]) },
    });
    for (const item of listArr[1]) {
      varbList.addChild("userVarbItem", {
        dbVarbs: {
          displayNameEditor: item[0],
          valueEditor: numObj(item[1]),
        },
      });
    }
  }
  const repairList = feUser.addAndGetChild("userVarbListMain", {
    dbVarbs: {
      displayName: stringObj(miscRepairList[0]),
    },
  });
  for (const item of miscRepairList[1]) {
    repairList.addChild("userVarbItem", {
      dbVarbs: {
        displayNameEditor: item[0],
        valueEditor: item[1],
      },
    });
  }
  return feUser.makeChildPackArr("userVarbListMain");
}
