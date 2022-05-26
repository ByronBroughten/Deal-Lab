import { VarbInfo } from "../SectionsMeta/Info";
import {
  MultiFindByFocalVarbInfo,
  MultiVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { VarbMetas } from "../SectionsMeta/VarbMetas";
import { FeVarbsInner } from "../SectionsState/FeSection/FeVarbs/FeVarbsCore";
import {
  GetterSection,
  GetterSectionBase,
  GetterSectionProps,
} from "./GetterSection";
import { GetterVarb } from "./GetterVarb";

export class GetterVarbs<SN extends SectionName> extends GetterSectionBase<SN> {
  private getterSection: GetterSection<SN>;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.getterSection = new GetterSection(props);
  }
  get stateVarbs(): FeVarbsInner<SN> {
    return this.getterSection.stateSection.varbs.core.varbs;
  }
  get meta(): VarbMetas {
    return this.getterSection.meta.varbsMeta;
  }
  get feVarbInfos(): VarbInfo<SN>[] {
    const { feSectionInfo } = this;
    return Object.keys(this.stateVarbs).map(
      (varbName) =>
        ({
          ...feSectionInfo,
          varbName,
        } as VarbInfo<SN>)
    );
  }
  thisIsType<T extends SectionNameType>(
    sectionNameType: T
  ): this is GetterSection<SectionName<T>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
  one(varbName: string): GetterVarb<SN & SectionName<"hasVarb">> {
    if (this.thisIsType("hasNoVarbs")) {
      throw new Error(
        `Section with sectionName ${this.sectionName} doesn't have any varbs.`
      );
    }
    return new GetterVarb({
      ...this.feSectionInfo,
      shared: this.shared,
      varbName,
    });
  }
  varbByFocalMixed<S extends SectionName<"hasVarb">>({
    varbName,
    ...mixedInfo
  }: MultiFindByFocalVarbInfo<S>): GetterVarb<S> {
    const section = this.getterSection.sectionByFocalMixed(mixedInfo);
    return section.varb(varbName);
  }
  varbsByFocalMixed<S extends SectionName<"hasVarb">>({
    varbName,
    ...mixedInfo
  }: MultiVarbInfo<S>): GetterVarb<S>[] {
    const sections = this.getterSection.sectionsByFocalMixed(mixedInfo);
    return sections.map((section) => section.varb(varbName));
  }
}
