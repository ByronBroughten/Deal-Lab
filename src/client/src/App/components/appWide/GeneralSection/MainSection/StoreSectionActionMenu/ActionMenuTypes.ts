export const guestActions = ["createNew"];

export const isNotSavedActions = ["save"] as const;
export const guestIsNotSavedActions = ["signInToSave"] as const;
const allIsNotSavedActions = [...isNotSavedActions, ...guestIsNotSavedActions];
type IsNotSavedActions = typeof allIsNotSavedActions[number];

export const guestIsSavedActions = ["signInToSave", "copy"] as const;
export const isSavedActions = [
  "saveUpdates",
  "saveAsNew",
  "copy",
  "copyAndSave",
  // "delete",
] as const;
const allIsSavedActions = [...guestIsSavedActions, ...isSavedActions];
type IsSavedActions = typeof allIsSavedActions[number];

export const alwaysActions = ["load", "createNew"] as const;
type AlwaysActions = typeof alwaysActions[number];
export type AllActions = IsNotSavedActions | IsSavedActions | AlwaysActions;

export interface ActionMenuLists {
  isNotSavedArr: readonly IsNotSavedActions[];
  isSavedArr: readonly IsSavedActions[];
  alwaysArr: readonly AlwaysActions[];
}

export type ActionMenuProps = Partial<ActionMenuLists>;
