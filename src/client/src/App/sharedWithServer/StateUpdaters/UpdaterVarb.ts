import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StateVarb } from "../StateSections/StateSectionsTypes";

export class UpdaterVarb<
  SN extends SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  private get raw(): StateVarb<SN> {
    return this.sectionsShare.sections.rawVarb(this.feVarbInfo);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.getterVarbProps);
  }
  get meta(): VarbMeta<SN> {
    return this.sectionsMeta.varb({
      sectionName: this.sectionName,
      varbName: this.varbName,
    });
  }
  updateValue(value: StateValue): void {
    this.get.meta.validateVarbValue(value);
    this.update({ value });
  }
  update(props: Partial<StateVarb<SN>>): void {
    this.sectionsShare.sections = this.sectionsShare.sections.updateVarb({
      feVarbInfo: this.feVarbInfo,
      rawVarb: {
        ...this.raw,
        ...props,
      },
    });
  }
}
