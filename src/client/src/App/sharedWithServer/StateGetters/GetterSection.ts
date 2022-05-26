import { HasSectionInfoProps } from "../HasInfoProps/HasSectionInfoProps";
import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import {
  FeParentInfo,
  FeParentInfoSafe,
  FeSectionInfo,
  InfoS,
  noParentWarning,
  VarbInfo,
} from "../SectionsMeta/Info";
import {
  MultiFindByFocalInfo,
  MultiSectionInfo,
  RelSectionInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
  SelfAndDescendantIds,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import { ValueTypesPlusAny } from "../SectionsState/FeSection/FeVarb";
import { FeSections } from "../SectionsState/SectionsState";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { GetterList } from "./GetterList";
import { GetterSections } from "./GetterSections";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export interface GetterSectionProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  shared: SharedSections;
}

export class GetterSectionBase<
  SN extends SectionName
> extends HasSectionInfoProps<SN> {
  readonly shared: SharedSections;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.shared = props.shared;
  }
  get getterSectionProps(): GetterSectionProps<SN> {
    return {
      ...this.feSectionInfo,
      shared: this.shared,
    };
  }
}

export class GetterSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  private getterSections: GetterSections;
  readonly varbs: GetterVarbs<SN>;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.getterSections = new GetterSections(props.shared);
    this.varbs = new GetterVarbs(props);
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

  // there are these, which are about getting a varb based also on a focal section
  // varbByRelative—varbs
  // varbsByRelative—varbs

  sectionByFocalMixed<S extends SectionName>(info: MultiFindByFocalInfo<S>) {
    if (InfoS.is.specific(info))
      return this.getterSections.sectionByMixed(info);
    else return this.sectionByRelative(info as RelSectionInfo<S>);
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
  sectionsByFocalMixed<S extends SectionName>(
    info: MultiSectionInfo<S>
  ): GetterSection<S>[] {
    if (InfoS.is.specific(info)) {
      const section = this.getterSections.sectionByMixed(info);
      return [section];
    } else if (InfoS.is.singleMulti(info)) {
      const section = this.sectionByFocalMixed(info);
      return [section];
    } else {
      return this.sectionsByRelative(info as any);
    }
  }
  sectionsByRelative<S extends SectionName>(
    info: RelSectionInfo<S>
  ): GetterSection<S>[] {
    const { sectionName } = info;
    switch (info.id) {
      case "all": {
        return this.getterSections.listNext(sectionName).arr;
      }
      case "children": {
        if (this.meta.isChildName(sectionName)) {
          return this.children(sectionName) as any as GetterSection<S>[];
        } else
          throw new Error(
            `"${sectionName}" is not a child of "${this.sectionName}"`
          );
      }
      default:
        throw new Error("Exhausted MultiSectionInfo options.");
    }
  }
  get meta(): SectionMeta<"fe", SN> {
    return this.getterSections.meta.section(this.sectionName);
  }
  get dbId(): string {
    return this.stateSection.dbId;
  }
  get idx() {
    return this.getterSections.list(this.sectionName).idx(this.feId);
  }
  get feInfo(): FeSectionInfo<SN> {
    return {
      feId: this.feId,
      sectionName: this.sectionName,
    };
  }
  children<CN extends ChildName<SN>>(childName: CN): GetterSection<CN>[] {
    const childIds = this.childFeIds(childName);
    return childIds.map((feId) =>
      this.getterSection({ sectionName: childName, feId })
    );
  }
  childList<CN extends ChildName<SN>>(childName: CN): GetterList<CN> {
    return this.getterSections.listNext(childName);
  }
  childrenOldToYoung<CN extends ChildName<SN>>(
    childName: CN
  ): GetterSection<CN>[] {
    return this.childList(childName).getByFeIds(this.childFeIds(childName));
  }
  varb(varbName: string): GetterVarb<SN> {
    return this.varbs.one(varbName);
  }
  value<VT extends ValueTypeName | "any">(
    varbName: string,
    valueType: VT
  ): ValueTypesPlusAny[VT] {
    return this.varb(varbName).value(valueType);
  }
  get selfAndDescendantVarbInfos() {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.getterSection(sectionInfo);

      return feVarbInfos.concat(...section.varbs.feVarbInfos);
    }, [] as VarbInfo[]);
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
  get selfAndDescendantFeIds(): SelfAndDescendantIds<SN> {
    const { feId, sectionName } = this;
    const descendantIds = this.descendantFeIds();
    return {
      [sectionName]: [feId] as string[],
      ...descendantIds,
    } as SelfAndDescendantIds<SN>;
  }
  get childNames(): ChildName<SN>[] {
    return this.meta.childNames;
  }
  childFeIds<CN extends ChildName<SN>>(childName: CN): string[] {
    return this.stateSection.childFeIds(childName);
  }
  descendantFeIds(): DescendantIds<SN> {
    const descendantIds: { [key: string]: string[] } = {};

    const queue: FeSectionInfo[] = [this.feInfo];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const feInfo = queue.shift();
        if (!feInfo) throw new Error("There should always be an feInfo here.");

        const section = this.getterSection(feInfo);
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
  get allChildFeIds(): ChildIdArrs<SN> {
    return this.stateSection.core.childFeIds as any as ChildIdArrs<SN>;
  }
  allChildDbIds(): ChildIdArrs<SN> {
    const { allChildFeIds } = this.stateSection;
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
  childInfos<CN extends ChildName<SN>>(childName: CN): FeSectionInfo<CN>[] {
    const childFeIds = this.childFeIds(childName);
    return childFeIds.map((feId) => ({
      sectionName: childName,
      feId,
    }));
  }

  youngestChild<CN extends ChildName<SN>>(childName: CN): GetterSection<CN> {
    const children = this.childrenOldToYoung(childName);
    return Arr.lastOrThrow(children);
  }
  isChildNameOrThrow(childName: any): childName is ChildName<SN> {
    if (!this.meta.isChildName(childName)) {
      throw new Error(`${childName} is not a child of ${this.sectionName}`);
    } else return true;
  }
  get parentInfo(): FeParentInfo<SN> {
    return this.stateSection.feParentInfo;
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
  getterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): GetterSection<S> {
    return new GetterSection({
      ...feInfo,
      shared: this.shared,
    });
  }
}
