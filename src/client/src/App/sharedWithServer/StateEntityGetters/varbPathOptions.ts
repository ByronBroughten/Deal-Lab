import { fullDisplayNameString } from "../SectionsMeta/allDisplaySectionVarbs";
import { mixedInfoS } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  getVarbPathExtras,
  getVarbPathParams,
  VarbPathNameProp,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import {
  fixedVarbOptionNames,
  ValueFixedVarbPathName,
  ValueInEntityInfo,
} from "./ValueInEntityInfo";

export type VariableOption = {
  varbInfo: ValueInEntityInfo;
  collectionName: string;
  displayName: string;
};

type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const varbPathOptionArr: VarbPathArrParam[] = fixedVarbOptionNames.map(
  (varbPathName) => ({
    varbPathName,
    ...getVarbPathParams(varbPathName),
  })
);

export const varbPathOptions = makeVarbPathOptions();
function makeVarbPathOptions(): VariableOption[] {
  return fixedVarbOptionNames.reduce((options, varbPathName) => {
    options.push(makeVarbPathOption(varbPathName));
    return options;
  }, [] as VariableOption[]);
}
function makeVarbPathOption(
  varbPathName: ValueFixedVarbPathName
): VariableOption {
  const { collectionName, sectionName, varbName } =
    getVarbPathExtras(varbPathName);
  return {
    collectionName,
    varbInfo: mixedInfoS.varbPathName(varbPathName),
    displayName: fullDisplayNameString(sectionName, varbName as any),
  };
}
