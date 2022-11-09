import {
  ActivePathName,
  activePathNames,
  activeVarbDisplayName,
  globalOptionVarbs,
} from "../SectionsMeta/absolutePathVarbs";
import { pathSectionName } from "../SectionsMeta/childPaths";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { PathVarbNames } from "../SectionsMeta/PathInfo";
import { sectionTrait } from "../SectionsMeta/sectionsTraits";
import { VariableOption } from "./VariableGetterSections";

export const absoluteVarbOptions = makeAbsoluteVarbOptions();
function makeAbsoluteVarbOptions(): VariableOption[] {
  return activePathNames.reduce((variableOptions, pathName) => {
    const varbNames = globalOptionVarbs[pathName];
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
  const sectionName = pathSectionName(pathName);
  return {
    varbInfo: mixedInfoS.absoluteVarbPathNext(pathName, varbName, "onlyOne"),
    collectionName: sectionTrait(sectionName, "displayName"),
    displayName: activeVarbDisplayName({ sectionName, varbName }),
  };
}
