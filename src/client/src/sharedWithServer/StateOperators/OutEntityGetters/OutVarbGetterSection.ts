import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { FeVarbInfo } from "../../StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../stateSchemas/schema6SectionChildren/SectionNameByType";
import { OutEntityGetterVarb } from "./OutEntityGetterVarb";

export class OutVarbGetterSection<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get selfAndDescendantActiveOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(
      this.selfAndDescendantActiveOutVarbInfos
    );
  }
  get selfAndDescendantActiveOutVarbInfos(): FeVarbInfo[] {
    const outVarbInfos: FeVarbInfo[] = [];
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const outVarbGetter = this.outVarbGetter(varbInfo);
      outVarbInfos.push(...outVarbGetter.activeOutEntities);
    }
    return outVarbInfos;
  }
  outVarbGetter<S extends SectionNameByType>(
    varbInfo: FeVarbInfo<S>
  ): OutEntityGetterVarb<S> {
    return new OutEntityGetterVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
}
