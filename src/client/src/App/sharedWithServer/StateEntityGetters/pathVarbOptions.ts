import {
  ActivePathName,
  activePathNames,
  activeVarbDisplayName,
  soloVarbOptions,
} from "../SectionsMeta/pathVarbOptionParams";
import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { PathVarbNames } from "../SectionsMeta/SectionInfo/PathNameInfo";
import { sectionNameByPathName } from "../SectionsMeta/sectionPathContexts/sectionPathNames";
import { VariableOption } from "./VariableGetterSections";

export const absoluteVarbOptions = makeAbsoluteVarbOptions();
function makeAbsoluteVarbOptions(): VariableOption[] {
  return activePathNames.reduce((variableOptions, pathName) => {
    const { varbNames, collectionName } = soloVarbOptions[pathName];
    for (const varbName of varbNames) {
      variableOptions.push(
        initAbsoluteVarbOption({ pathName, collectionName, varbName })
      );
    }
    return variableOptions;
  }, [] as VariableOption[]);
}
function initAbsoluteVarbOption<PN extends ActivePathName>({
  pathName,
  varbName,
  collectionName,
}: PathVarbNames<PN> & { collectionName: string }): VariableOption {
  const sectionName = sectionNameByPathName(pathName);
  return {
    varbInfo: mixedInfoS.pathNameVarb(pathName, varbName, "onlyOne"),
    collectionName,
    displayName: activeVarbDisplayName({ sectionName, varbName }),
  };
}
