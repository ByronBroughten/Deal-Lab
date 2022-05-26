import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import { HasVarbInfoProps } from "../HasInfoProps/HasVarbInfoProps";
import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb, { FeVarbOptions } from "../SectionsState/FeSection/FeVarb";
import { StateValue } from "../SectionsState/FeSection/FeVarb/feValue";
import { FeSections } from "../SectionsState/SectionsState";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { UpdaterSections } from "./UpdaterSections";

interface SharedSectionsVarbProps<SN extends SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  shared: SharedSections;
}

export class UpdaterVarb<
  SN extends SectionName<"hasVarb">
> extends HasVarbInfoProps<SN> {
  readonly shared: SharedSections;
  private updaterSections: UpdaterSections;
  private getterVarb: GetterVarb<SN>;
  constructor(props: SharedSectionsVarbProps<SN>) {
    super(props);
    this.shared = props.shared;
    this.updaterSections = new UpdaterSections(props.shared);
    this.getterVarb = new GetterVarb(props);
  }
  private get sections(): FeSections {
    return this.shared.sections;
  }
  get selfVarb(): FeVarb<SN> {
    return this.sections.varb(this.feVarbInfo);
  }
  updateValueByEditor(value: StateValue): void {
    this.update(this.selfVarb.updateValue(value));
  }
  updateValueDirectly(value: StateValue): void {
    const nextVarb = this.selfVarb.updateValue(value);
    this.update(nextVarb.triggerEditorUpdate());
  }
  update(nextVarb: FeVarb<SN>): void {
    // how do I want to do this?
    // this works pretty well, yeah?
    this.updaterSections.updateVarb(nextVarb);
  }
  updateProps(props: FeVarbOptions) {
    this.update(
      new FeVarb({
        ...this.selfVarb.core,
        ...props,
      })
    );
  }
}
