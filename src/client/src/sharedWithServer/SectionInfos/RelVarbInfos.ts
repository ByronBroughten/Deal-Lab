import { SectionName } from "../sectionVarbsConfig/SectionName";
import { ChildName } from "../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import { Obj } from "../utils/Obj";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "./RelVarbInfo";

type RelLocalVarbInfos<SN extends SectionName, VN extends string> = {
  [V in VN]: RelLocalVarbInfo;
};

export const relVarbInfosS = {
  localByVarbName<SN extends SectionName, VN extends string>(
    varbNames: readonly VN[]
  ): RelLocalVarbInfos<SN, VN> {
    return varbNames.reduce((localInfos, varbName) => {
      localInfos[varbName] = relVarbInfoS.localBase(varbName);
      return localInfos;
    }, {} as RelLocalVarbInfos<SN, VN>);
  },
  local(varbNames: string[]): RelLocalVarbInfo[] {
    return varbNames.map((varbName) => {
      return relVarbInfoS.localBase(varbName);
    });
  },
  children<
    SN extends SectionName = SectionName,
    CN extends ChildName<SN> = ChildName<SN>
  >(childName: CN, varbNames: string[]): RelChildrenVarbInfo<SN, CN>[] {
    return varbNames.map((varbName) =>
      relVarbInfoS.children(childName, varbName)
    );
  },
  namedChildren<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    kwargsToVarbNames: Record<string, string>
  ): Record<string, RelChildrenVarbInfo<SN, CN>> {
    return Obj.keys(kwargsToVarbNames).reduce((namedChildren, kwarg) => {
      const varbName = kwargsToVarbNames[kwarg];
      namedChildren[kwarg] = relVarbInfoS.children(childName, varbName);
      return namedChildren;
    }, {} as Record<string, RelChildrenVarbInfo<SN, CN>>);
  },
};
