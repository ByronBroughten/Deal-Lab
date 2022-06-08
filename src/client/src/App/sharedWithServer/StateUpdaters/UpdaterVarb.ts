import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { RawFeVarb } from "../StateSections/StateSectionsNext";

export class UpdaterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb(this.feVarbInfo);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.getterVarbProps);
  }
  get manualUpdateEditorToggle(): boolean | undefined {
    return this.raw.manualUpdateEditorToggle;
  }
  triggerEditorUpdate(): void {
    return this.update({
      manualUpdateEditorToggle: !this.manualUpdateEditorToggle,
    });
  }
  updateValueByEditor(value: StateValue): void {
    this.updateValue(value);
  }
  updateValueDirectly(value: StateValue): void {
    this.updateValue(value);
    this.triggerEditorUpdate();
  }
  private updateValue(value: StateValue): void {
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
