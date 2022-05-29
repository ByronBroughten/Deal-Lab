import { DbVarbs } from "../Analyzer/SectionPackRaw/RawSection";
import {
  StateValueAnyKey,
  ValueTypesPlusAny,
} from "../FeSections/FeSection/FeVarb";
import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
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
import { RawFeVarbs } from "../StateSections/StateSectionsNext";
import { Obj } from "../utils/Obj";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";

export class GetterVarbs<SN extends SectionName> extends GetterSectionBase<SN> {
  private getterSection = new GetterSection(this.getterSectionProps);
  private get stateVarbs(): RawFeVarbs<SN> {
    return this.sectionsShare.sections.rawSection(this.feSectionInfo).varbs;
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
  get varbNames(): string[] {
    return Obj.keys(this.stateVarbs) as string[];
  }
  thisIsType<T extends SectionNameType>(
    sectionNameType: T
  ): this is GetterSection<SectionName<T>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
  one(varbName: string): GetterVarb<SN & SectionName<"hasVarb">> {
    // this commented code was good when there were sections with no varbs. otherwise it throws.
    // if (this.thisIsType("hasNoVarbs")) {
    //   throw new Error(
    //     `Section with sectionName ${this.sectionName} doesn't have any varbs.`
    //   );
    // }
    return new GetterVarb({
      ...this.feSectionInfo,
      sectionsShare: this.sectionsShare,
      varbName,
    });
  }
  values<T extends ValuesRequest>(varbTypes: T): RequestedValues<T> {
    return Obj.entriesFull(varbTypes).reduce(
      (partial, [varbName, varbType]) => {
        partial[varbName] = this.one(varbName as string).value(varbType) as any;
        return partial;
      },
      {} as RequestedValues<T>
    );
  }
  get varbInfoValues(): InEntityVarbInfo {
    return this.values({
      sectionName: "string",
      varbName: "string",
      id: "string",
      idType: "string",
    }) as InEntityVarbInfo;
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
  get dbVarbs(): DbVarbs {
    return this.varbNames.reduce((dbVarbs, varbName) => {
      dbVarbs[varbName] = this.one(varbName).toDbValue();
      return dbVarbs;
    }, {} as DbVarbs);
  }
}

type ValuesRequest = {
  [varbName: string]: StateValueAnyKey;
};

type RequestedValues<T extends ValuesRequest> = {
  [Prop in keyof T]: ValueTypesPlusAny[T[Prop]];
};