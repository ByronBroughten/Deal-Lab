import { Id } from "../../SectionsMeta/IdS";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { Obj } from "../../utils/Obj";
import { userVarbLifespans } from "./makeExampleOngoingListsProps";

type UserVarbLifespansMap = typeof userVarbLifespans;
type UserVarbLifespanArrs = UserVarbLifespansMap[keyof UserVarbLifespansMap][];
const userVarbLifespanArrs: UserVarbLifespanArrs = Obj.keys(
  userVarbLifespans
).map((key) => {
  return userVarbLifespans[key];
});

const fullLists = [
  ["Average lifespan examples", userVarbLifespanArrs],
  [
    "Common repair examples",
    [
      ["Swap toilet hardware", numObj(30)],
      ["Change deadbolt", numObj(20)],
      ["Add smoke detector", numObj(15)],
      ["Install outlet", numObj(30)],
    ],
  ],
  [
    "Replacement cost examples",
    [
      ["Vinyl plank per sqft", numObj(3)],
      ["Force Air Furnace", numObj(3500)],
      ["Water heater", numObj(1200)],
      ["Window", numObj(500)],
      ["Stove", numObj(600)],
      ["Refrigerator", numObj(800)],
      ["Laundry", numObj(1200)],
      ["Roof", numObj(8000)],
    ],
  ],
] as const;

const lists = [
  [
    "Example collection",
    [
      ["Change lock cost", numObj(20)],
      ["New HVAC Cost", numObjNext(["numUnits"], "*4000")],
      ["Flooring $ per sqft", numObj(4)],
    ],
  ],
] as const;

const userVarbNames = [
  "btusPerSqft",
  "propertyBtus",
  "hvacBtusToCost",
  "hvacBaseCost",
  "replaceHvacCost",
] as const;

type UserVarbName = (typeof userVarbNames)[number];

const dbIds = userVarbNames.reduce((userVarbDbIds, name) => {
  userVarbDbIds[name] = Id.make();
  return userVarbDbIds;
}, {} as Record<UserVarbName, string>);

const exampleHvacVariables = [
  [
    "HVAC Example Variables",
    [
      ["BTUs per sqft", numObj(20), dbIds.btusPerSqft],
      [
        "Property BTUs",
        numObjNext(["sqft"], "*", [dbIds.btusPerSqft, "BTUs per sqft"]),
        dbIds.propertyBtus,
      ],
      [
        "HVAC BTU cost",
        numObjNext([dbIds.propertyBtus, "Property BTUs"], "/50"),
        dbIds.hvacBtusToCost,
      ],
      ["HVAC base cost", numObjNext("2000*", ["numUnits"]), dbIds.hvacBaseCost],
      [
        "Replace HVAC cost",
        numObjNext([dbIds.hvacBtusToCost, "HVAC BTU cost"], "+", [
          dbIds.hvacBaseCost,
          "HVAC base cost",
        ]),
        dbIds.replaceHvacCost,
      ],
    ],
  ],
] as const;

export function makeExampleUserVarbLists(): SectionPack<"numVarbList">[] {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  for (const listArr of exampleHvacVariables) {
    const varbList = feStore.addAndGetChild("numVarbListMain", {
      sectionValues: { displayName: stringObj(listArr[0]) },
    });
    for (const item of listArr[1]) {
      varbList.addChild("numVarbItem", {
        dbId: item[2],
        sectionValues: {
          displayNameEditor: item[0],
          valueEditor: item[1],
        },
      });
    }
  }

  return feStore.makeChildPackArr("numVarbListMain");
}
