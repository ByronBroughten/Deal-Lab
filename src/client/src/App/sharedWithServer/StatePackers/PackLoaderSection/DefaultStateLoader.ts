import {
  hasDefaultChild,
  makeDefaultChildPack,
} from "../../defaultMaker/defaultChildMakers";
import { defaultMaker } from "../../defaultMaker/defaultMaker";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { UpdaterSection } from "../../StateUpdaters/UpdaterSection";
import { SelfPackLoader } from "./SelfPackLoader";

export class DefaultStateLoader<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  selfPackLoader(sectionPack: SectionPack<SN>): SelfPackLoader<SN> {
    return new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
  }
  loadSelfDefaultState() {
    const parentUpdater = this.updater.parent;
    const parentSectionName = parentUpdater.sectionName;

    const { sectionName, selfChildName } = this.get;

    let sectionPack: SectionPack<SN> | undefined;
    if (hasDefaultChild(parentSectionName, selfChildName)) {
      sectionPack = makeDefaultChildPack(
        parentUpdater,
        selfChildName
      ) as SectionPack<SN>;
    } else if (defaultMaker.has(sectionName)) {
      sectionPack = defaultMaker.makeSectionPack(sectionName);
    }
    if (sectionPack) {
      this.selfPackLoader(sectionPack).overwriteSelfWithPack();
    }
  }
}
