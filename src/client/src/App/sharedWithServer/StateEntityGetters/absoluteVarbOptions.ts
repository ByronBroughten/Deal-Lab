import {
  ActivePathName,
  activePathNames,
  activeVarbDisplayName,
  soloVarbOptions,
} from "../SectionsMeta/absolutePathVarbs";
import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { PathVarbNames } from "../SectionsMeta/SectionInfo/AbsolutePathInfo";
import { sectionNameByPathName } from "../SectionsMeta/sectionPathContexts/sectionPathNames";
import { sectionTrait } from "../SectionsMeta/sectionsTraits";
import { VariableOption } from "./VariableGetterSections";

export const absoluteVarbOptions = makeAbsoluteVarbOptions();
function makeAbsoluteVarbOptions(): VariableOption[] {
  return activePathNames.reduce((variableOptions, pathName) => {
    const varbNames = soloVarbOptions[pathName];
    for (const varbName of varbNames) {
      variableOptions.push(initAbsoluteVarbOption({ pathName, varbName }));
    }
    return variableOptions;
  }, [] as VariableOption[]);
}
function initAbsoluteVarbOption<PN extends ActivePathName>({
  pathName,
  varbName,
}: PathVarbNames<PN>): VariableOption {
  const sectionName = sectionNameByPathName(pathName);
  return {
    varbInfo: mixedInfoS.absoluteVarbPath(pathName, varbName, "onlyOne"),
    collectionName: sectionTrait(sectionName, "displayName"),
    displayName: activeVarbDisplayName({ sectionName, varbName }),
  };
}
