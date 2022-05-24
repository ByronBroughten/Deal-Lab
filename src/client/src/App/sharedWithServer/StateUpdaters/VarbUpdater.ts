import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import { HasVarbInfoProps } from "../HasInfoProps/HasVarbInfoProps";
import { VarbInfo } from "../SectionsMeta/Info";
import { MultiFindByFocalVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb, { FeVarbOptions } from "../SectionsState/FeSection/FeVarb";
import { StateValue } from "../SectionsState/FeSection/FeVarb/feValue";
import { FeSections } from "../SectionsState/SectionsState";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSections } from "./SectionUpdater";

interface SharedSectionsVarbProps<SN extends SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  shared: SharedSections;
}
class SharedSectionsVarb<
  SN extends SectionName<"hasVarb">
> extends HasVarbInfoProps<SN> {
  readonly shared: SharedSections;
  constructor(props: SharedSectionsVarbProps<SN>) {
    super(props);
    this.shared = props.shared;
  }
}

export class GetterVarb<
  SN extends SectionName<"hasVarb">
> extends SharedSectionsVarb<SN> {
  private getterSection = new GetterSection(this.constructorProps);
  get sections(): FeSections {
    return this.shared.sections;
  }
  private get stateVarb(): FeVarb<SN> {
    return this.sections.varb(this.feVarbInfo);
  }
  get constructorProps(): SharedSectionsVarbProps<SN> {
    return {
      ...this.feVarbInfo,
      shared: this.shared,
    };
  }

  varbByFocal({ varbName, ...feInfo }: MultiFindByFocalVarbInfo): FeVarb {
    const section = this.sectionByFocal(focalInfo, feInfo);
    // when the multiInfo has "parent" as its relative id
    // if the relativeId is based on SectionMeta, there is
    // a chance the parent won't have the varbName
    return section.varb(varbName);
  }
}

export class VarbUpdater<
  SN extends SectionName<"hasVarb">
> extends HasVarbInfoProps<SN> {
  readonly shared: SharedSections;
  private updaterSections: UpdaterSections;
  constructor(props: SharedSectionsVarbProps<SN>) {
    super(props);
    this.shared = props.shared;
    this.updaterSections = new UpdaterSections(this.shared);
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
