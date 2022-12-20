import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";

export const closingCostsExamples = [] as const;

const lists = [
  [
    "Misc upfront cost examples",
    [
      ["Inspection", 500],
      ["Change locks", 120],
      ["Entryway mats", 100],
      ["Radon test", 200],
    ],
  ],
] as const;

export function makeExampleUserSingleTimeLists(): SectionPack<"singleTimeList">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  for (const listArr of lists) {
    const varbList = feUser.addAndGetChild("singleTimeListMain", {
      dbVarbs: { displayName: stringObj(listArr[0]) },
    });
    for (const item of listArr[1]) {
      varbList.addChild("singleTimeItem", {
        dbVarbs: {
          displayNameEditor: item[0],
          numObjEditor: numObj(item[1]),
        },
      });
    }
  }
  return feUser.makeChildPackArr("singleTimeListMain");
}
