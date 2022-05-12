import { cloneDeep } from "lodash";
import { GConstructor } from "../../../utils/classObjects";
import { FeInfo, InfoS } from "../../SectionMetas/Info";
import {
  ChildFeInfo,
  ChildIdArrs,
  ChildName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import { HasFeSectionProps } from "./HasFeSectionProps";

export interface IChildIdGetterNext<SN extends SectionName>
  extends HasFeSectionProps<SN> {
  get allChildFeIds(): ChildIdArrs<SN>;
  childFeIds(childName: ChildName<SN>): string[];
  allChildFeInfos(): FeInfo[];
  childFeInfos(childName: ChildName<SN>): FeInfo[];
  childIdx({ sectionName, id }: ChildFeInfo<SN>): number;
}

type HasSectionProps<SN extends SectionName> = GConstructor<
  HasFeSectionProps<SN>
>;
export function ChildIdGetterNext<
  SN extends SectionName,
  TBase extends HasSectionProps<SN>
>(Base: TBase) {
  return class ChildIdGetterNext
    extends Base
    implements IChildIdGetterNext<SN>
  {
    get allChildFeIds(): ChildIdArrs<SN> {
      return cloneDeep(this.core.childFeIds);
    }
    childFeIds(childName: ChildName<SN>): string[] {
      const { childFeIds } = this.core;
      if (childName in childFeIds) {
        return childFeIds[childName];
      } else
        throw new Error(
          `${childName} is not in section of sectionName ${this.core.sectionName}`
        );
    }
    allChildFeInfos(): FeInfo[] {
      const childFeIds = this.allChildFeIds;
      return Obj.entries(childFeIds).reduce((feInfos, [childName, feIds]) => {
        const newFeInfos = feIds.map((id) => InfoS.fe(childName, id));
        return feInfos.concat(newFeInfos);
      }, [] as FeInfo[]);
    }
    childFeInfos(childName: ChildName<SN>): FeInfo[] {
      const childFeIds = this.childFeIds(childName);
      return childFeIds.map((id) => ({
        sectionName: childName,
        id,
        idType: "feId",
      })) as FeInfo[];
    }
    childIdx({ sectionName, id }: ChildFeInfo<SN>): number {
      const idx = this.childFeIds(sectionName).indexOf(id);
      if (idx === -1)
        throw new Error(`Section at ${sectionName}.${id} not in its parent.`);
      return idx;
    }
  };
}

export class ChildIdGetter<
  SN extends SectionName
> extends HasFeSectionProps<SN> {
  get allChildFeIds(): ChildIdArrs<SN> {
    return cloneDeep(this.core.childFeIds);
  }
  childFeIds(childName: ChildName<SN>): string[] {
    const { childFeIds } = this.core;
    if (childName in childFeIds) {
      return childFeIds[childName];
    } else
      throw new Error(
        `${childName} is not in section of sectionName ${this.core.sectionName}`
      );
  }
  allChildFeInfos(): FeInfo[] {
    const childFeIds = this.allChildFeIds;
    return Obj.entries(childFeIds).reduce((feInfos, [childName, feIds]) => {
      const newFeInfos = feIds.map((id) => InfoS.fe(childName, id));
      return feInfos.concat(newFeInfos);
    }, [] as FeInfo[]);
  }
  childFeInfos(childName: ChildName<SN>): FeInfo[] {
    const childFeIds = this.childFeIds(childName);
    return childFeIds.map((id) => ({
      sectionName: childName,
      id,
      idType: "feId",
    })) as FeInfo[];
  }
  childIdx({ sectionName, id }: ChildFeInfo<SN>): number {
    const idx = this.childFeIds(sectionName).indexOf(id);
    if (idx === -1)
      throw new Error(`Section at ${sectionName}.${id} not in its parent.`);
    return idx;
  }
}
