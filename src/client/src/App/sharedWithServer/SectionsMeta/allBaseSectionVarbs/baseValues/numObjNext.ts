import {
  getVarbPathParams,
  varbPathInfo,
  VarbPathName,
} from "../../SectionInfo/VarbPathNameInfo";
import { pathSectionName } from "../../sectionPathContexts/sectionPathNames";
import { getVarbMeta } from "../../VarbMeta";
import { Id } from "../id";
import { ValueInEntity } from "./entities";
import { NumObj } from "./NumObj";

export function numObjNext(...propArr: EntityNumObjPropArr): NumObj {
  let mainText: string = "";
  let solvableText: string = "";
  const entities: ValueInEntity[] = [];
  for (const prop of propArr) {
    if (typeof prop === "string") {
      mainText += prop;
      solvableText += prop;
    } else if (typeof prop === "number") {
      mainText += `${prop}`;
      solvableText += `${prop}`;
    } else {
      const varbPathName = prop[0];
      const entityInfo = varbPathInfo(varbPathName);
      const { pathName, varbName } = getVarbPathParams(varbPathName);
      const sectionName = pathSectionName(pathName);
      const text = getVarbMeta({ sectionName, varbName }).displayNameFull;

      entities.push({
        ...entityInfo,
        entityId: Id.make(),
        length: text.length,
        offset: mainText.length,
        entitySource: "editor",
      });
      mainText += text;
      solvableText += "?";
    }
  }
  entities.sort((a, b) => b.offset - a.offset);
  return {
    mainText,
    entities,
    solvableText,
  };
}

type EntityNumObjPropArr = (number | string | [VarbPathName])[];
