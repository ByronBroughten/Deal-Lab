import { Obj } from "../../../utils/Obj";
import { Id } from "../../baseSectionsVarbs/id";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { mixedInfoS } from "../../sectionChildrenDerived/MixedSectionInfo";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { SectionPathName } from "../../sectionPathContexts/sectionPathNames";

export type UpdateFnProp = PathInVarbInfo & { entityId: string };
export const updateFnPropS = {
  local(varbName: string): UpdateFnProp {
    return {
      ...relVarbInfoS.local(varbName),
      entityId: Id.make(),
    };
  },
  children(childName: ChildName, varbName: string) {
    return {
      ...relVarbInfoS.children(childName, varbName),
      entityId: Id.make(),
    };
  },
  absolutePath(pathName: SectionPathName, varbName: string): UpdateFnProp {
    return {
      ...mixedInfoS.pathNameVarb(pathName, varbName),
      entityId: Id.make(),
    };
  },
};

export const updateFnPropsS = {
  namedChildren(
    childName: ChildName,
    kwargToVarbNames: Record<string, string>
  ): UpdateFnProps {
    return Obj.keys(kwargToVarbNames).reduce((namedChildren, kwarg) => {
      const varbName = kwargToVarbNames[kwarg];
      namedChildren[kwarg] = updateFnPropS.children(childName, varbName);
      return namedChildren;
    }, {} as UpdateFnProps);
  },
  childrenByVarbName(
    childName: ChildName,
    varbNames: string[]
  ): UpdateFnProp[] {
    return varbNames.map((varbName) =>
      updateFnPropS.children(childName, varbName)
    );
  },
  localByVarbName(varbNames: string[]): UpdateFnProps {
    return varbNames.reduce((localInfos, varbName) => {
      localInfos[varbName] = updateFnPropS.local(varbName);
      return localInfos;
    }, {} as UpdateFnProps);
  },
  localArr(varbNames: string[]): UpdateFnProp[] {
    return varbNames.map((varbName) => {
      return updateFnPropS.local(varbName);
    });
  },
};

export type UpdateFnProps = {
  [kwargName: string]: UpdateFnProp | UpdateFnProp[];
};
