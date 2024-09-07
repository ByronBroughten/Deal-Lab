import {
  sectionVarbNames,
  VarbNameWide,
} from "../../sharedWithServer/stateSchemas/derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { sectionVarbValueName } from "../../sharedWithServer/stateSchemas/derivedFromBaseSchemas/baseSectionValues";
import { sectionNames } from "../../sharedWithServer/stateSchemas/SectionName";
import { ValueName } from "../../sharedWithServer/stateSchemas/ValueName";
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
