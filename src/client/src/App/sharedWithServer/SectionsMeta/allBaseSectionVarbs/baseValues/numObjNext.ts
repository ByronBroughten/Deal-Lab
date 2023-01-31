import { StrictOmit } from "../../../utils/types";
import { mixedInfoS } from "../../sectionChildrenDerived/MixedSectionInfo";
import { PathVarbNamesNext } from "../../SectionInfo/PathNameInfo";
import {
  getVarbPathParams,
  VarbPathName,
  VarbSectionPathName,
} from "../../SectionInfo/VarbPathNameInfo";
import {
  pathSectionName,
  SectionPathVarbName,
} from "../../sectionPathContexts/sectionPathNames";
import { getVarbMeta } from "../../VarbMeta";
import { Id } from "../id";
import { PathNameInEntity, ValueInEntity } from "./entities";
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
      const { pathName, varbName } = getVarbPathParams(varbPathName);
      const entityInfo = pathNameEntityInfo({
        pathName,
        varbName: varbName as SectionPathVarbName<typeof pathName>,
      });

      const sectionName = pathSectionName(pathName);
      const text = getVarbMeta({ sectionName, varbName }).displayNameFull;
      entities.push({
        ...entityInfo,
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
}: PathVarbNamesNext<PN>): StrictOmit<
  PathNameInEntity,
  "length" | "offset" | "entityId"
> {
  return {
    entitySource: "editor",
    ...mixedInfoS.pathNameVarb(pathName, varbName),
  };
}
