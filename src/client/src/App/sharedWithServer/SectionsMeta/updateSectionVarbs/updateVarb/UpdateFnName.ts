import { calculationNames } from "../../values/StateValue/valuesShared/calculations";
import { ValueName, valueNames } from "../../values/ValueName";

export type UpdateFnName<VN extends ValueName = ValueName> =
  UpdateFnNames[VN][number];

type UpdateFnNames = typeof updateFnNames;

const checkUpdateFnNames = (updateFnNames: {
  [VN in ValueName]: GeneralUpdateFnNames;
}) => updateFnNames;

const commonUpdateFnNames = ["manualUpdateOnly", "throwIfReached"] as const;
const updateFnNames = checkUpdateFnNames({
  // the first updateFnName in each group is the one used by default.
  ...makeDefaults(),
  numObj: [
    "calcVarbs",
    "userVarb",
    "virtualNumObj",
    "loadSolvableTextByVarbInfo",
    "loadNumObj",
    "getNumObjOfSwitch",
    "solvableTextZero",
    "emptyNumObj",
    ...calculationNames,
    ...commonUpdateFnNames,
  ],
  stringObj: [
    ...commonUpdateFnNames,
    "loadLocalString",
    "loadMainTextByVarbInfo",
    "manualUpdateOnly",
    "loadDisplayName",
    "loadDisplayNameEnd",
    "loadStartAdornment",
    "loadEndAdornment",
    "emptyStringObj",
  ],
  number: [...commonUpdateFnNames, "numberOne"],
  string: [...commonUpdateFnNames, "propertyCompletionStatus"],
  boolean: [...commonUpdateFnNames, "varbExists"],
});

export const getUpdateFnNames = <VN extends ValueName>(
  valueName: VN
): UpdateFnName<VN>[] => updateFnNames[valueName] as UpdateFnName<VN>[];

type GeneralUpdateFnNames = readonly string[];
type DefaultUpdateFnNames = {
  [VN in ValueName]: typeof commonUpdateFnNames;
};
function makeDefaults(): DefaultUpdateFnNames {
  return valueNames.reduce((defaults, valueName) => {
    defaults[valueName] = commonUpdateFnNames;
    return defaults;
  }, {} as DefaultUpdateFnNames);
}

const editorUpdateNames = [
  "calcVarbs",
  "string",
  "stringArray",
  "stringObj",
  "manualUpdateOnly",
] as const;

type EditorUpdateName = typeof editorUpdateNames[number];
export function isEditorUpdateFnName(value: string): value is EditorUpdateName {
  return editorUpdateNames.includes(value as any);
}
