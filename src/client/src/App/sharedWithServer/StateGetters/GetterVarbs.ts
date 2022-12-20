import {
  StateValueAnyKey,
  ValueTypesPlusAny,
} from "../SectionsMeta/baseSectionsVarbs/StateVarbTypes";
import { DbVarbs } from "../SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionNameByType";
import { StateVarbs } from "../StateSections/StateSectionsTypes";
import { Obj } from "../utils/Obj";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";

export class GetterVarbs<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  get section() {
    return new GetterSection(this.getterSectionProps);
  }
  private get stateVarbs(): StateVarbs<SN> {
    return this.sectionsShare.sections.rawSection(this.feSectionInfo).varbs;
  }
  get sections(): GetterSections {
    return new GetterSections(this.getterSectionsProps);
  }
  get feVarbInfos(): FeVarbInfo<SN>[] {
    const { feSectionInfo } = this;
    return Object.keys(this.stateVarbs).map(
      (varbName) =>
        ({
          ...feSectionInfo,
          varbName,
        } as FeVarbInfo<SN>)
    );
  }
  get varbNames(): string[] {
    return Obj.keys(this.stateVarbs) as string[];
  }
  thisIsType<T extends SectionNameType>(
    sectionNameType: T
  ): this is GetterSection<SectionNameByType<T>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
  values<T extends ValuesRequest>(varbTypes: T): RequestedValues<T> {
    return Obj.entriesFull(varbTypes).reduce(
      (partial, [varbName, varbType]) => {
        partial[varbName] = this.section
          .varb(varbName as string)
          .value(varbType) as any;
        return partial;
      },
      {} as RequestedValues<T>
    );
  }
  get dbVarbs(): DbVarbs {
    return this.varbNames.reduce((dbVarbs, varbName) => {
      dbVarbs[varbName] = this.section.varb(varbName).value();
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
