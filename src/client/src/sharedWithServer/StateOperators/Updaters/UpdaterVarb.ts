import { SectionNameByType } from "../../SectionNameByType";
import { StateVarb } from "../../State/StateSectionsTypes";
import { GetterVarbBase } from "../../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { VarbMeta } from "../../stateSchemas/StateMeta/VarbMeta";
import { StateValue } from "../../stateSchemas/StateValue";

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
    this.meta.validateValue(value);
    this.update({ value });
  }
  setValueToInit(): void {
    this.update({ value: this.meta.initValue });
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
