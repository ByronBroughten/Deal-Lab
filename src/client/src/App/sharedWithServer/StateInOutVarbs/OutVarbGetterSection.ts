import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutVarbGetterVarb } from "./OutVarbGetterVarb";

export class OutVarbGetterSection<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get selfAndDescendantOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantOutVarbInfos);
  }
  get selfAndDescendantOutVarbInfos(): FeVarbInfo[] {
    const outVarbInfos: FeVarbInfo[] = [];
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const outVarbGetter = this.outVarbGetter(varbInfo);
      outVarbInfos.push(...outVarbGetter.outVarbInfos);
    }
    return outVarbInfos;
  }
  outVarbGetter<S extends SectionNameByType>(
    varbInfo: FeVarbInfo<S>
  ): OutVarbGetterVarb<S> {
    return new OutVarbGetterVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
}
