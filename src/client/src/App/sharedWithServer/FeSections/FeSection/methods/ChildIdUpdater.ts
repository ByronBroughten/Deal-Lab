import { applyMixins } from "../../../../utils/classObjects";
import {
  ChildName,
  NewChildInfo,
} from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import Arr from "../../../utils/Arr";
import FeSection from "../../FeSection";
import { FeSectionBasicUpdater, HasFeSectionCore } from "../../FeSectionCore";
import { ChildIdGetter } from "./ChildIdGetter";

export class ChildIdUpdater<
  SN extends SectionName
> extends HasFeSectionCore<SN> {
  private updateChildFeIdArr(
    sectionName: ChildName<SN>,
    nextIds: string[]
  ): FeSection<SN> {
    return this.update({
      childFeIds: {
        ...this.core.childFeIds,
        [sectionName]: nextIds,
      },
    });
  }
  private insertChildFeId({
    sectionName,
    feId,
    idx,
  }: NewChildInfo<SN> & { idx: number }): FeSection<SN> {
    const nextIds = Arr.insert(this.childFeIds(sectionName), feId, idx);
    return this.updateChildFeIdArr(sectionName, nextIds);
  }
  private pushChildFeId({
    sectionName,
    feId,
  }: NewChildInfo<SN>): FeSection<SN> {
    let nextIds = [...this.childFeIds(sectionName), feId];
    return this.updateChildFeIdArr(sectionName, nextIds);
  }
  addChildFeId({ idx, ...childInfo }: NewChildInfo<SN>): FeSection<SN> {
    if (typeof idx === "number")
      return this.insertChildFeId({ ...childInfo, idx });
    else return this.pushChildFeId(childInfo);
  }
  removeChildFeId({ sectionName, feId }: NewChildInfo<SN>) {
    const nextIds = Arr.findAndRmClone(
      this.childFeIds(sectionName),
      (childId) => childId === feId
    );
    return this.update({
      childFeIds: {
        ...this.core.childFeIds,
        [sectionName]: nextIds,
      },
    });
  }
}

export interface ChildIdUpdater<SN extends SectionName>
  extends ChildIdGetter<SN>,
    FeSectionBasicUpdater<SN> {}

applyMixins(ChildIdUpdater, [ChildIdGetter, FeSectionBasicUpdater]);
