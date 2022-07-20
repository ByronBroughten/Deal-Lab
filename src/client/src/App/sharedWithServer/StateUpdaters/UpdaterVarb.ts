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
  // those varbs are updating directly.
  // and then they're updating directly again.
  // so then they end up with the same editor toggle.
  // is that right?

  // basically, the editor needs to know when an update
  // has occured. It can't know, though, that the update
  // came from the editor.
  // Ok, wait. Maybe when the editor updates the value
  // I save the edit

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
