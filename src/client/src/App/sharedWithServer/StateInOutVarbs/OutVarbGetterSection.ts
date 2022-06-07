import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutVarbGetterVarb } from "./OutVarbGetterVarb";

export class OutVarbGetterSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionProps);
  get selfAndDescendantOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantOutVarbInfos);
  }
  get selfAndDescendantOutVarbInfos(): VarbInfo[] {
    const outVarbInfos: VarbInfo[] = [];
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const outVarbGetter = this.outVarbGetter(varbInfo);
      outVarbInfos.push(...outVarbGetter.outVarbInfos);
    }
    return outVarbInfos;
  }
  outVarbGetter<S extends SectionName>(
    varbInfo: VarbInfo<S>
  ): OutVarbGetterVarb<S> {
    return new OutVarbGetterVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
}
