import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { Obj } from "../../utils/Obj";

export const userVarbLifespans = {
  roof: ["Roof", 12],
  waterHeater: ["Water heater", 12],
  hvac: ["HVAC", 20],
  interiorPaint: ["Interior paint", 10],
  windows: ["Windows", 50],
  siding: ["Siding", 9000],
  appliances: ["Appliances", 10],
  plumbing: ["Plumbing", 50],
  driveway: ["Driveway", 50],
  laundry: ["Laundry", 12],
  flooring: ["Flooring", 20],
  structure: ["Structure", 50],
  cabinetsCounters: ["Cabinets/counters", 20],
  garageDoor: ["Garage door", 10],
  landscaping: ["Landscaping", 10],
} as const;

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
          numObjEditor: numObj(item[1]),
        },
      });
    }
  }
  return feUser.makeChildPackArrs("userVarbListMain");
}
