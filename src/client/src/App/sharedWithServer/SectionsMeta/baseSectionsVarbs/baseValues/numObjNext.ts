import { StrictOmit } from "../../../utils/types";
import { mixedInfoS } from "../../sectionChildrenDerived/MixedSectionInfo";
import { PathVarbNames } from "../../SectionInfo/PathNameInfo";
import {
  VarbPathName,
  VarbSectionPathName,
  varbSectionPathName,
} from "../../SectionInfo/VarbPathNameInfo";
import { getVarbMeta } from "../../VarbMeta";
import { Id } from "../id";
import { AbsoluteInEntity, ValueInEntity } from "./entities";
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
      const varbName = prop[0];
      const pathName = varbSectionPathName(varbName);
      const { sectionName, ...rest } = pathNameEntityInfo({
        pathName,
        varbName,
      });

      const text = getVarbMeta({ sectionName, varbName }).displayNameFull;
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
  entities.sort((a, b) => b.offset - a.offset);
  return {
    mainText,
    entities,
    solvableText,
  };
}

type EntityNumObjPropArr = (number | string | [VarbPathName])[];

function pathNameEntityInfo<PN extends VarbSectionPathName>({
  pathName,
  varbName,
}: PathVarbNames<PN>): StrictOmit<
  AbsoluteInEntity,
  "length" | "offset" | "entityId"
> {
  return {
    entitySource: "editor",
    ...mixedInfoS.pathNameVarb(pathName, varbName, "onlyOne"),
  };
}
