import { Id } from "../Ids/IdS";
import { SectionPack } from "../SectionPacks/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { numObj } from "../sectionVarbsConfig/StateValue/NumObj";
import { stringObj } from "../sectionVarbsConfig/StateValue/StringObj";
import { numObjNext } from "../sectionVarbsConfig/StateValue/numObjNext";

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
