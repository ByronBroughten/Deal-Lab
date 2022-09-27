export const isNotSavedActions = ["save"] as const;
type IsNotSavedActions = typeof isNotSavedActions[number];

export const isSavedActions = [
  "saveUpdates",
  "saveAsNew",
  "copy",
  "copyAndSave",
  // "delete",
] as const;
type IsSavedActions = typeof isSavedActions[number];

export const alwaysActions = ["createNew"] as const;
type AlwaysActions = typeof alwaysActions[number];
export type AllActions = IsNotSavedActions | IsSavedActions | AlwaysActions;

export interface ActionMenuProps {
  isNotSavedArr?: readonly IsNotSavedActions[];
  isSavedArr?: readonly IsSavedActions[];
  alwaysArr?: readonly AlwaysActions[];
}
