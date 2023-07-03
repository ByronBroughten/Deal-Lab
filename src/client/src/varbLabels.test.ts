import {
  sectionVarbNames,
  VarbNameWide,
} from "./App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { sectionVarbValueName } from "./App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionValues";
import { sectionNames } from "./App/sharedWithServer/SectionsMeta/SectionName";
import { ValueName } from "./App/sharedWithServer/SectionsMeta/values/ValueName";
import { varbLabels } from "./varbLabels";

function checkAllVarbLabels() {
  const pathsNeedingLabels = [];
  for (const sectionName of sectionNames) {
    const varbLs = varbLabels[sectionName];
    const varbNames = sectionVarbNames(sectionName);
    for (const varbName of varbNames) {
      const valueName = sectionVarbValueName(
        sectionName,
        varbName
      ) as ValueName;

      if (
        (valueName === "numObj" ||
          (varbName as VarbNameWide) === "valueSourceName") &&
        !varbLs[varbName]
      ) {
        pathsNeedingLabels.push(`${sectionName}.${varbName}`);
      }
    }
  }
  if (pathsNeedingLabels.length > 0) {
    throw new Error(
      `The following varbs need labels:\n${pathsNeedingLabels.join("\n")}`
    );
  }
}

describe("varbLabels", () => {
  it("should not throw", () => {
    expect(checkAllVarbLabels).not.toThrow();
  });
});
