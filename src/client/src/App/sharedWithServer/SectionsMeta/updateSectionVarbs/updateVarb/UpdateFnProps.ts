import { Obj } from "../../../utils/Obj";
import { VarbNameWide } from "../../baseSectionsDerived/baseSectionsVarbsTypes";
import { Id } from "../../IdS";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { mixedInfoS } from "../../SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { VarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../sectionPathContexts/sectionPathNames";
import { UpdateOverrideSwitch } from "./UpdateOverrideSwitch";

export type UpdateFnProps = {
  [propName: string]: UpdateFnProp | UpdateFnProp[];
};

export function collectUpdateFnSwitchProps(
  updateFnProps: UpdateFnProps
): UpdateFnProps {
  const andPropSwitches: UpdateFnProp[] = [];
  for (const propName of Obj.keys(updateFnProps)) {
    const uProp = updateFnProps[propName];
    const arrProp = Array.isArray(uProp) ? uProp : [uProp];
    for (const prop of arrProp) {
      const { andSwitches } = prop;
      for (const andSwitch of andSwitches) {
        const andSwitchInfo = andSwitch.switchInfo;
        if (andSwitchInfo.infoType === "local") {
          if (prop.infoType === "children") {
            andPropSwitches.push(
              updateFnProp({
                ...prop,
                varbName: andSwitchInfo.varbName,
              })
            );
          } else if (prop.infoType === "pathName") {
            andPropSwitches.push(
              updateFnProp({
                ...prop,
                varbName: andSwitchInfo.varbName as any,
              })
            );
          } else {
            throw new Error(
              `prop has an infoType of ${prop.infoType}, but that hasn't been handled here yet`
            );
          }
        } else {
          andPropSwitches.push(updateFnProp(andSwitch.switchInfo));
        }
      }
    }
  }
  return {
    ...updateFnProps,
    andPropSwitches: andPropSwitches,
  };
}

export const updateFnPropsS = {
  varbPathArr(...varbPathNames: VarbPathName[]): UpdateFnProp[] {
    return varbPathNames.map((name) => updatePropS.varbPathName(name));
  },
  namedChildren(
    childName: ChildName,
    kwargToVarbNames: Record<string, string>
  ): UpdateFnProps {
    return Obj.keys(kwargToVarbNames).reduce((namedChildren, kwarg) => {
      const varbName = kwargToVarbNames[kwarg];
      namedChildren[kwarg] = updatePropS.children(childName, varbName);
      return namedChildren;
    }, {} as UpdateFnProps);
  },
  childrenByVarbName(
    childName: ChildName,
    varbNames: string[]
  ): UpdateFnProp[] {
    return varbNames.map((varbName) =>
      updatePropS.children(childName, varbName)
    );
  },
  localByVarbName(varbNames: VarbNameWide[]): UpdateFnProps {
    return varbNames.reduce((localInfos, varbName) => {
      localInfos[varbName] = updatePropS.local(varbName);
      return localInfos;
    }, {} as UpdateFnProps);
  },
  localArr(...varbNames: VarbNameWide[]): UpdateFnProp[] {
    return varbNames.map((varbName) => {
      return updatePropS.local(varbName);
    });
  },
  localBaseNameArr(varbNames: string[]): UpdateFnProp[] {
    return varbNames.map((varbName) => {
      return updatePropS.localBaseName(varbName);
    });
  },
};
export const upsS = updateFnPropsS;

export function updateFnProp(
  varbInfo: PathInVarbInfo,
  andSwitches: UpdateOverrideSwitch[] = []
): UpdateFnProp {
  return {
    ...varbInfo,
    andSwitches,
    entityId: Id.make(),
  };
}

export type UpdateFnProp = PathInVarbInfo & {
  entityId: string;
  andSwitches: UpdateOverrideSwitch[];
};
export const updatePropS = {
  local(
    varbName: VarbNameWide,
    andSwitches?: UpdateOverrideSwitch[]
  ): UpdateFnProp {
    return updateFnProp(relVarbInfoS.local(varbName), andSwitches);
  },
  localBaseName(baseName: string) {
    return updateFnProp(relVarbInfoS.localBase(baseName));
  },
  localArr(...varbNames: string[]): UpdateFnProp[] {
    return varbNames.map((varbName) =>
      updateFnProp(relVarbInfoS.localBase(varbName))
    );
  },
  children(
    childName: ChildName,
    varbName: string,
    andSwitches?: UpdateOverrideSwitch[]
  ) {
    return updateFnProp(
      relVarbInfoS.children(childName, varbName),
      andSwitches
    );
  },
  onlyChild(
    childName: ChildName,
    varbName: VarbNameWide,
    andSwitches?: UpdateOverrideSwitch[]
  ) {
    return updateFnProp(
      relVarbInfoS.onlyChild(childName, varbName),
      andSwitches
    );
  },
  firstChild(
    childName: ChildName,
    varbName: VarbNameWide,
    andSwitches?: UpdateOverrideSwitch[]
  ) {
    return updateFnProp(
      relVarbInfoS.firstChild(childName, varbName),
      andSwitches
    );
  },
  onlyChildBase(
    childName: ChildName,
    varbName: string,
    andSwitches?: UpdateOverrideSwitch[]
  ) {
    return updateFnProp(
      relVarbInfoS.onlyChild(childName, varbName),
      andSwitches
    );
  },
  pathName<PN extends SectionPathName>(
    pathName: PN,
    varbName: SectionPathVarbName<PN>,
    andSwitches: UpdateOverrideSwitch[] = []
  ): UpdateFnProp {
    return updateFnProp(
      mixedInfoS.pathNameVarb(pathName, varbName),
      andSwitches
    );
  },
  pathNameBase<PN extends SectionPathName>(
    pathName: PN,
    varbName: string,
    andSwitches: UpdateOverrideSwitch[] = []
  ): UpdateFnProp {
    return updateFnProp(
      mixedInfoS.pathNameVarb(pathName, varbName as SectionPathVarbName<PN>),
      andSwitches
    );
  },
  varbPathName(varbPathName: VarbPathName) {
    return updateFnProp(mixedInfoS.varbPathName(varbPathName));
  },
  varbPathBase(varbPathName: string) {
    return updateFnProp(mixedInfoS.varbPathName(varbPathName as VarbPathName));
  },
  completionStatus(
    props: Partial<CompletionStatusProps>
  ): CompletionStatusProps {
    return {
      notEmptySolvable: [],
      nonZeros: [],
      nonNone: [],
      notFalse: [],
      validInputs: [],
      othersValid: [],
      ...props,
    };
  },
};

export const upS = updatePropS;

export type CompletionStatusProps = {
  notEmptySolvable: UpdateFnProp[];
  nonZeros: UpdateFnProp[];
  nonNone: UpdateFnProp[];
  notFalse: UpdateFnProp[];
  validInputs: UpdateFnProp[];
  othersValid: UpdateFnProp[];
};
