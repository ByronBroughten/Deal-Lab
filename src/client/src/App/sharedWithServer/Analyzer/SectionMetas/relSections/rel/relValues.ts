import { BaseValueName, BaseValueTypes } from "../baseSections/baseValues";
import { numObjUpdateInfos } from "./relValues/numObjUpdates";
import { updateInfo, UpdateInfos, UpdateInfo } from "./relValues/updateInfo";
import { UpdateName } from "./relValuesTypes";

type GeneralRelValues = {
  [Prop in BaseValueName]: {
    updateInfos: UpdateInfos<BaseValueTypes[Prop]>;
    defaultUpdateName: UpdateName<Prop>;
  };
};
export const relValues = {
  numObj: {
    defaultUpdateName: "entityEditor",
    updateInfos: numObjUpdateInfos,
  },
  string: {
    defaultUpdateName: "direct",
    updateInfos: {
      loadDisplayName: updateInfo(
        "loadedDisplayName",
        ({ loadedDisplayName }) => {
          return loadedDisplayName ?? "Variable not found.";
        }
      ),
      direct: updateInfo("direct", ({ value }) => value as string),
    },
  },
  number: {
    defaultUpdateName: "direct",
    updateInfos: {
      direct: updateInfo("direct", ({ value }) => value as number),
    },
  },
  boolean: {
    defaultUpdateName: "direct",
    updateInfos: {
      direct: updateInfo("direct", ({ value }) => value as boolean),
    },
  },
  stringArray: {
    defaultUpdateName: "direct",
    updateInfos: {
      direct: updateInfo("direct", ({ value }) => value as string[]),
    },
  },
} as const;
const relValuesTest = <R extends GeneralRelValues>(_: R) => undefined;
relValuesTest(relValues);
export type RelValues = typeof relValues;
