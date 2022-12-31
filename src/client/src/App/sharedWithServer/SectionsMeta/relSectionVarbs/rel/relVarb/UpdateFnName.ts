import { ValueName, valueNames } from "../../../baseSectionsVarbs/baseVarb";
import { calculationNames } from "./calculationsNext";

export type UpdateFnName<VN extends ValueName = ValueName> =
  UpdateFnNames[VN][number];

type UpdateFnNames = typeof updateFnNames;

const checkUpdateFnNames = (updateFnNames: {
  [VN in ValueName]: GeneralUpdateFnNames;
}) => updateFnNames;

const updateFnNames = checkUpdateFnNames({
  ...makeDefaults(),
  numObj: [
    "calcVarbs",
    "manualUpdateOnly",
    "userVarb",
    "virtualNumObj",
    "loadSolvableTextByVarbInfo",
    "loadNumObj",
    "getNumObjOfSwitch",
    ...calculationNames,
  ],
  stringObj: [
    "manualUpdateOnly",
    "loadLocalString",
    "manualUpdateOnly",
    "loadDisplayName",
    "loadDisplayNameEnd",
    "loadStartAdornment",
    "loadEndAdornment",
    "emptyStringObj",
  ],
});

export const getUpdateFnNames = <VN extends ValueName>(
  valueName: VN
): UpdateFnName<VN>[] => updateFnNames[valueName] as UpdateFnName<VN>[];

type GeneralUpdateFnNames = readonly string[];
type DefaultUpdateFnNames = {
  [VN in ValueName]: ["manualUpdateOnly"];
};
function makeDefaults(): DefaultUpdateFnNames {
  return valueNames.reduce((defaults, valueName) => {
    defaults[valueName] = ["manualUpdateOnly"];
    return defaults;
  }, {} as DefaultUpdateFnNames);
}
