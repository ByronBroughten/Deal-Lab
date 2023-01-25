import { Obj } from "../../../utils/Obj";
import { Id } from "../../allBaseSectionVarbs/id";
import { ExpectedCount } from "../../allBaseSectionVarbs/NanoIdInfo";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { mixedInfoS } from "../../sectionChildrenDerived/MixedSectionInfo";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { VarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../sectionPathContexts/sectionPathNames";
import { UpdateOverrideSwitch } from "./UpdateOverrides";

export type UpdateFnProps = {
  [propName: string]: UpdateFnProp | UpdateFnProp[];
};

export type CompletionStatusProps = {
  nonZeros: UpdateFnProp[];
  validInputs: UpdateFnProp[];
  othersValid: UpdateFnProp[];
};

export function completionStatusProps(
  props: Partial<CompletionStatusProps>
): CompletionStatusProps {
  return {
    nonZeros: [],
    validInputs: [],
    othersValid: [],
    ...props,
  };
}

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
        const { switchInfo } = andSwitch;
        if (switchInfo.infoType === "local") {
          if (prop.infoType === "pathName") {
            andPropSwitches.push(
              updateFnProp({
                ...prop,
                varbName: switchInfo.varbName,
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
    return varbPathNames.map((name) => updateFnPropS.varbPathName(name));
  },
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
  // so here... I'm providing loanVarbInfo
  // I'll get multiple loanVarbs

  //
  andSwitches: UpdateOverrideSwitch[];
};
export const updateFnPropS = {
  local(varbName: string): UpdateFnProp {
    return updateFnProp(relVarbInfoS.local(varbName));
  },
  localArr(...varbNames: string[]): UpdateFnProp[] {
    return varbNames.map((varbName) =>
      updateFnProp(relVarbInfoS.local(varbName))
    );
  },
  children(childName: ChildName, varbName: string) {
    return updateFnProp(relVarbInfoS.children(childName, varbName));
  },
  onlyChild(childName: ChildName, varbName: string) {
    return updateFnProp(relVarbInfoS.onlyChild(childName, varbName));
  },
  pathName(
    pathName: SectionPathName,
    varbName: string,
    andSwitches: UpdateOverrideSwitch[] = []
  ): UpdateFnProp {
    return updateFnProp(
      mixedInfoS.pathNameVarb(pathName, varbName),
      andSwitches
    );
  },
  pathNameNext<PN extends SectionPathName>(
    pathName: PN,
    varbName: SectionPathVarbName<PN>,
    andSwitches: UpdateOverrideSwitch[] = []
  ): UpdateFnProp {
    return updateFnProp(
      mixedInfoS.pathNameVarb(pathName, varbName as string),
      andSwitches
    );
  },
  varbPathName(
    varbPathName: VarbPathName,
    expectedCount: ExpectedCount = "onlyOne"
  ) {
    return updateFnProp(mixedInfoS.varbPathName(varbPathName, expectedCount));
  },
  varbPathBase(varbPathName: string, expectedCount: ExpectedCount = "onlyOne") {
    return updateFnProp(
      mixedInfoS.varbPathName(varbPathName as VarbPathName, expectedCount)
    );
  },
};