import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { PathVarbNamesNext } from "../SectionsMeta/SectionInfo/PathNameInfo";
import {
  allVarbPathParams,
  VarbSectionPathName,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import { pathSectionName } from "../SectionsMeta/sectionPathContexts/sectionPathNames";
import { getVarbMeta } from "../SectionsMeta/VarbMeta";
import { Obj } from "../utils/Obj";
import { VariableOption } from "./VariableGetterSections";

export const absoluteVarbOptions = makeAbsoluteVarbOptions();
function makeAbsoluteVarbOptions(): VariableOption[] {
  return Obj.keys(allVarbPathParams).reduce((options, key) => {
    options.push(initAbsoluteVarbOption(allVarbPathParams[key] as any));
    return options;
  }, [] as VariableOption[]);
}
function initAbsoluteVarbOption<PN extends VarbSectionPathName>({
  pathName,
  varbName,
  collectionName,
}: PathVarbNamesNext<PN> & { collectionName: string }): VariableOption {
  const sectionName = pathSectionName(pathName);
  return {
    varbInfo: mixedInfoS.pathNameVarb(pathName, varbName),
    collectionName,
    displayName: getVarbMeta({ sectionName, varbName: varbName as string })
      .displayNameFull,
  };
}
