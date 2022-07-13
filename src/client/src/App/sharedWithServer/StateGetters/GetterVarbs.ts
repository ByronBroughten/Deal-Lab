import { DbVarbs } from "../SectionPack/RawSection";
import {
  StateValueAnyKey,
  ValueTypesPlusAny,
} from "../SectionsMeta/baseSectionsUtils/StateVarbTypes";
import { VarbInfo, VarbStringInfo } from "../SectionsMeta/Info";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { RawFeVarbs } from "../StateSections/StateSectionsTypes";
import { Obj } from "../utils/Obj";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarb } from "./GetterVarb";

export class GetterVarbs<SN extends SectionName> extends GetterSectionBase<SN> {
  get section() {
    return new GetterSection(this.getterSectionProps);
  }
  private get stateVarbs(): RawFeVarbs<SN> {
    return this.sectionsShare.sections.rawSection(this.feSectionInfo).varbs;
  }
  get sections(): GetterSections {
    return new GetterSections(this.getterSectionsProps);
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
  get varbInfoStringValues(): VarbStringInfo {
    return this.values({
      sectionName: "string",
      varbName: "string",
      id: "string",
      infoType: "string",
    });
  }
  get dbVarbs(): DbVarbs {
    return this.varbNames.reduce((dbVarbs, varbName) => {
      dbVarbs[varbName] = this.one(varbName).value();
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
