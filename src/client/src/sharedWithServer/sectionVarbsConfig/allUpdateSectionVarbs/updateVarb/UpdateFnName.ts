import { calculationNames } from "../../StateValue/stateValuesShared/calculations";
import { ValueName, valueNames } from "../../ValueName";

export type UpdateFnName<VN extends ValueName = ValueName> =
  UpdateFnNames[VN][number];

type UpdateFnNames = typeof updateFnNames;

type AllGeneralUpdateFnNames = {
  [VN in ValueName]: GeneralUpdateFnNames;
};
const checkUpdateFnNames = <UNS extends AllGeneralUpdateFnNames>(
  updateFnNames: UNS
): UNS => updateFnNames;

const commonUpdateFnNames = ["manualUpdateOnly", "throwIfReached"] as const;
const updateFnNames = checkUpdateFnNames({
  // the first updateFnName in each group is the one used by default.
  ...makeDefaults(),
  numObj: [
    "calcVarbs",
    "notApplicable",
    "userVarb",
    "virtualNumObj",
    "loadSolvableTextByVarbInfo",
    "loadNumObj",
    "getNumObjOfSwitch",
    "currentYear",
    "solvableTextZero",
    "solvableTextOne",
    "solvableText300",
    "solvableTextPointOne",
    "solvableTextPointZeroFive",
    "solvableTextPointEightFive",
    "solvableTextPointOneFive",
    "emptyNumObj",
    ...calculationNames,
    ...commonUpdateFnNames,
  ] as const,
  stringObj: [
    ...commonUpdateFnNames,
    "localStringToStringObj",
    "loadMainTextByVarbInfo",
    "manualUpdateOnly",
    "emptyStringObj",
    "financingDisplayName",
    "defaultDealDisplayName",
  ] as const,
  number: [...commonUpdateFnNames, "numberOne"] as const,
  boolean: [...commonUpdateFnNames, "varbExists", "activeIsComplete"] as const,
  completionStatus: [...commonUpdateFnNames, "completionStatus"] as const,
});

export const getUpdateFnNames = <VN extends ValueName>(
  valueName: VN
): readonly UpdateFnName<VN>[] =>
  updateFnNames[valueName] as readonly UpdateFnName<VN>[];

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

type EditorUpdateName = (typeof editorUpdateNames)[number];
export function isEditorUpdateFnName(value: string): value is EditorUpdateName {
  return editorUpdateNames.includes(value as any);
}
