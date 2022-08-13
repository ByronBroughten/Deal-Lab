import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { RawFeVarb } from "../StateSections/StateSectionsTypes";

export class UpdaterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb(this.feVarbInfo);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.getterVarbProps);
  }
  updateValue(value: StateValue): void {
    this.get.meta.validateVarbValue(value);
    this.update({ value });
  }
  update(props: Partial<RawFeVarb<SN>>): void {
    this.sectionsShare.sections = this.sectionsShare.sections.updateVarb({
      feVarbInfo: this.feVarbInfo,
      rawVarb: {
        ...this.raw,
        ...props,
      },
    });
  }
}
