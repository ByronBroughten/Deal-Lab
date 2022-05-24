import { HasSectionInfoProps } from "../HasInfoProps/HasSectionInfoProps";
import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import {
  FeParentInfo,
  FeParentInfoSafe,
  FeSectionInfo,
  noParentWarning,
} from "../SectionsMeta/Info";
import {
  FeVarbInfo,
  RelSectionInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
  DescendantName,
  SelfAndDescendantIds,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb, { ValueTypesPlusAny } from "../SectionsState/FeSection/FeVarb";
import { FeVarbsI } from "../SectionsState/FeSection/FeVarbs";
import { FeSections } from "../SectionsState/SectionsState";
import { Obj } from "../utils/Obj";
import { GetterSections } from "./GetterSections";

export interface GetterSectionProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  shared: SharedSections;
}

export class GetterSection<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  readonly shared: SharedSections;
  private getterSections: GetterSections;
  constructor({ shared, ...info }: GetterSectionProps<SN>) {
    super(info);
    this.shared = shared;
    this.getterSections = new GetterSections(this.shared);
  }
  private get stateSections(): FeSections {
    return this.shared.sections;
  }
  get stateSection(): FeSectionI<SN> {
    return this.stateSections.one(this.feInfo);
  }
  get constructorProps(): GetterSectionProps<SN> {
    return {
      ...this.feInfo,
      shared: this.shared,
    };
  }

  thisIsSectionType<S extends SectionName>(
    sectionName: S
  ): this is GetterSection<S> {
    return this.sectionName === (sectionName as any);
  }
  sectionByRelative<S extends SectionName>(
    info: RelSectionInfo<S>
  ): GetterSection<S> {
    switch (info.id) {
      case "local": {
        if (this.thisIsSectionType(info.sectionName)) return this;
        else throw new Error("Local section did not match the focal section.");
      }
      case "parent": {
        return this.parent as any as GetterSection<S>;
      }
      default:
        throw new Error("Exhausted MultiFindByFocalInfo options.");
    }
  }

  get meta() {
    return this.section.meta;
  }
  get dbId(): string {
    return this.section.dbId;
  }
  get feInfo(): FeSectionInfo<SN> {
    return {
      feId: this.feId,
      sectionName: this.sectionName,
    };
  }
  get idx() {
    return this.getterSections.list(this.sectionName).idx(this.feId);
  }
  childSections<CN extends ChildName<SN>>(childName: CN): FeSectionI<CN>[] {
    const ids = this.section.childFeIds(childName);
    return ids.map((feId) =>
      this.sections.section({ sectionName: childName, feId })
    );
  }
  get section(): FeSectionI<SN> {
    return this.sections.one(this.feInfo);
  }
  get varbs(): FeVarbsI<SN> {
    return this.section.varbs;
  }
  varb(varbName: string): FeVarb {
    return this.varbs.one(varbName);
  }
  value<VT extends ValueTypeName | "any">(
    varbName: string,
    valueType: VT
  ): ValueTypesPlusAny[VT] {
    return this.varb(varbName).value(valueType);
  }

  get selfAndDescendantFeIds(): SelfAndDescendantIds<SN> {
    const { feId, sectionName } = this.section;
    const descendantIds = this.descendantFeIds();
    return {
      [sectionName]: [feId] as string[],
      ...descendantIds,
    } as SelfAndDescendantIds<SN>;
  }
  get selfAndDescendantSectionInfos() {
    const feIds = this.selfAndDescendantFeIds;
    return Obj.keys(feIds).reduce((feSectionInfos, sectionName) => {
      const sectionInfos = feIds[sectionName].map(
        (feId) =>
          ({
            sectionName,
            feId,
          } as FeSectionInfo)
      );
      return feSectionInfos.concat(...sectionInfos);
    }, [] as FeSectionInfo[]);
  }
  get selfAndDescendantVarbInfos() {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.sections.section(sectionInfo);
      return feVarbInfos.concat(...section.varbs.infos);
    }, [] as FeVarbInfo[]);
  }
  childFeIds<CN extends ChildName<SN>>(childName: CN): string[] {
    return this.section.childFeIds(childName);
  }
  descendantFeIds(): DescendantIds<SN> {
    const descendantIds: { [key: string]: string[] } = {};

    const queue: FeSectionInfo[] = [this.feInfo];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const feInfo = queue.shift();
        if (!feInfo) throw new Error("There should always be an feInfo here.");

        const section = this.sections.one(feInfo);
        for (const childName of section.meta.childNames) {
          if (!(childName in descendantIds)) descendantIds[childName] = [];

          section.childFeIds(childName).forEach((feId) => {
            if (!descendantIds[childName].includes(feId)) {
              descendantIds[childName].push(feId);
            }
          });
          queue.push(...section.childInfos(childName));
        }
      }
    }
    return descendantIds as any;
  }
  firstDescendantSection<DN extends DescendantName<SN>>(
    descendantName: DN
  ): FeSectionI<DN> {
    const feId = this.firstDescendantFeId(descendantName);
    return this.sections.one({ sectionName: descendantName, feId });
  }
  firstDescendantFeId<DN extends DescendantName<SN>>(
    descendantName: DN
  ): string {
    const descendantFeIds = this.descendantFeIds();
    const firstId = descendantFeIds[descendantName][0];
    if (firstId) return firstId;
    else
      throw new Error(
        `No feId was found with descendantName ${descendantName} and parentName ${this.sectionName}.`
      );
  }
  allChildDbIds(): ChildIdArrs<SN> {
    const { allChildFeIds } = this.section;
    return Obj.entries(allChildFeIds).reduce(
      (childDbIds, [sectionName, idArr]) => {
        const dbIds = idArr.map(
          (feId) => this.getterSections.sectionNext({ sectionName, feId }).dbId
        );
        childDbIds[sectionName] = dbIds;
        return childDbIds;
      },
      {} as ChildIdArrs<SN>
    );
  }
  get parentInfo(): FeParentInfo<SN> {
    return this.section.feParentInfo;
  }
  get parentInfoSafe(): FeParentInfoSafe<SN> {
    const { parentInfo } = this.stateSection;
    if (parentInfo.sectionName === noParentWarning)
      throw new Error("This section doesn't have a parent.");
    return parentInfo as FeParentInfoSafe<SN>;
  }
  get parent(): GetterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this;
    return this.getterSections.sectionNext(parentInfoSafe);
  }
}
