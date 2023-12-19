import { fixedVariableLabel } from "../../../varbLabels/varbLabels";
import { Id } from "../../Ids/IdS";
import {
  ValueFixedVarbPathName,
  ValueInEntityInfo,
} from "../../SectionInfos/ValueInEntityInfo";
import {
  getVarbPathParams,
  varbPathDbIdInfo,
  varbPathInfo,
} from "../../SectionInfos/VarbPathNameInfo";
import { pathSectionName } from "../../sectionPaths/sectionPathNames";
import { NumObj } from "./NumObj";
import { ValueInEntity } from "./stateValuesShared/entities";

type FixedEntity = [ValueFixedVarbPathName];
type DbIdEntity = [string, string];
function isDbIdEntity(value: FixedEntity | DbIdEntity): value is DbIdEntity {
  return value.length === 2;
}

export function numObjNext(...propArr: EntityNumObjPropArr): NumObj {
  let mainText: string = "";
  let solvableText: string = "";
  const entities: ValueInEntity[] = [];
  const makeAndAddEntity = (
    entityInfo: ValueInEntityInfo,
    varbLabel: string,
    mainText: string
  ) => {
    entities.push({
      ...entityInfo,
      entityId: Id.make(),
      length: varbLabel.length,
      offset: mainText.length,
      entitySource: "editor",
    });
  };

  for (const prop of propArr) {
    if (typeof prop === "string") {
      mainText += prop;
      solvableText += prop;
    } else if (typeof prop === "number") {
      mainText += `${prop}`;
      solvableText += `${prop}`;
    } else {
      let varbLabel = "";
      if (isDbIdEntity(prop)) {
        const dbId = prop[0];
        varbLabel = prop[1];
        const entityInfo = varbPathDbIdInfo("userVarbValue", dbId);
        makeAndAddEntity(entityInfo, varbLabel, mainText);
      } else {
        const str = prop[0];
        const varbPathName = str;
        const entityInfo = varbPathInfo(varbPathName);
        const { pathName, varbName } = getVarbPathParams(varbPathName);
        const sectionName = pathSectionName(pathName);
        varbLabel = fixedVariableLabel(sectionName, varbName as any);
        makeAndAddEntity(entityInfo, varbLabel, mainText);
      }
      mainText += varbLabel;
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

type EntityNumObjPropArr = (
  | number
  | string
  | [ValueFixedVarbPathName]
  | [string, string]
)[];
