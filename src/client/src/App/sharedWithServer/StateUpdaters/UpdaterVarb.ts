import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { RawFeVarb } from "../StateSections/StateSectionsNext";

export class UpdaterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb(this.feVarbInfo);
  }
  get manualUpdateEditorToggle(): boolean | undefined {
    return this.raw.manualUpdateEditorToggle;
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
  triggerEditorUpdate(): void {
    return this.update({
      manualUpdateEditorToggle: !this.manualUpdateEditorToggle,
    });
  }
  updateValueByEditor(value: StateValue): void {
    this.update({ value });
  }
  updateValueDirectly(value: StateValue): void {
    this.update({ value });
    this.triggerEditorUpdate();
  }
}
