import { NumObj } from "../../baseSections/baseValues/NumObj";
import { ValueNameArrObjToValueObj } from "./updateProps";
import { calculationUpdates } from "./numObjUpdateInfos/calculationUpdates";
import { equationVarbUpdate } from "./numObjUpdateInfos/equationVarbUpdate";
import { userVarbUpdate } from "./numObjUpdateInfos/userVarbUpdate";
import { updateInfo } from "./updateInfo";

export const basicNumObjInherentProp = {
  current: ["numObj"],
  roundTo: ["number"],
  finishingTouch: ["finishingTouch", "undefined"],
} as const;
export type BasicNumObjInherentProps = ValueNameArrObjToValueObj<
  typeof basicNumObjInherentProp
>;

export const numObjUpdateInfos = {
  ...calculationUpdates.all,
  direct: updateInfo("direct", ({ value }) => value as NumObj),
  userVarb: userVarbUpdate.info,
  entityEditor: equationVarbUpdate,
  editorValue: updateInfo(
    "currentAndEditor",
    (numObj: { current: NumObj; editor: NumObj }) => {
      return numObj.current.updateCache({
        ...numObj.editor.cache,
      });
    }
  ),
  loadedVarb: updateInfo(
    "currentAndLoaded",
    (numObj: { current: NumObj; loaded: NumObj | undefined }) => {
      const nextCache = numObj.loaded
        ? numObj.loaded.cache
        : ({
            solvableText: "?",
            number: "?",
          } as const);
      const nextNumObj = numObj.current.updateCache(nextCache);
      const nextEntities = numObj.current.entities.filter(
        (entity) => entity.length === 0
      );
      return nextNumObj.updateCore({
        editorText: `${nextCache.number}`,
        entities: nextEntities,
      });
    }
  ),
};
