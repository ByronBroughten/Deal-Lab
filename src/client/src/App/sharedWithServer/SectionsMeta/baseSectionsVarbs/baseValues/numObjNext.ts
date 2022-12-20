import { StrictOmit } from "../../../utils/types";
import {
  ActivePathName,
  activeVarbDisplayName,
  OptionVarbName,
  optionVarbPathName,
} from "../../absolutePathVarbs";
import { PathVarbNames } from "../../SectionInfo/AbsolutePathInfo";
import { sectionNameByPathName } from "../../sectionPathContexts/sectionPathNames";
import { Id } from "../id";
import { AbsoluteInEntity, InEntities } from "./entities";
import { NumObj } from "./NumObj";

export function numObjNext(...propArr: EntityNumObjPropArr): NumObj {
  let mainText: string = "";
  let solvableText: string = "";
  const entities: InEntities = [];
  for (const prop of propArr) {
    if (typeof prop === "string") {
      mainText += prop;
      solvableText += prop;
    } else if (typeof prop === "number") {
      mainText += `${prop}`;
      solvableText += `${prop}`;
    } else {
      const varbName = prop[0];
      const pathName = optionVarbPathName(varbName);
      const { sectionName, ...rest } = absoluteEntityInfo({
        pathName,
        varbName,
      });
      const text = activeVarbDisplayName({ sectionName, varbName });
      entities.push({
        ...rest,
        sectionName,
        entityId: Id.make(),
        length: text.length,
        offset: mainText.length,
      });
      mainText += text;
      solvableText += "?";
    }
  }
  return {
    mainText,
    entities,
    solvableText,
  };
}

type EntityNumObjPropArr = (number | string | [OptionVarbName])[];

function absoluteEntityInfo<PN extends ActivePathName>({
  pathName,
  varbName,
}: PathVarbNames<PN>): StrictOmit<
  AbsoluteInEntity,
  "length" | "offset" | "entityId"
> {
  return {
    entitySource: "editor",
    expectedCount: "onlyOne",
    infoType: "absolutePath",
    pathName,
    sectionName: sectionNameByPathName(pathName),
    varbName: varbName as string,
  };
}
