import { SwitchTargetKey } from "../SectionsMeta/baseSections/baseSwitchNames";
import { ValueTypesPlusAny } from "../SectionsMeta/baseSections/StateVarbTypes";
import {
  SwitchEndingKey,
  switchNames,
} from "../SectionsMeta/baseSections/switchNames";
import { DbSectionInfo } from "../SectionsMeta/DbSectionInfo";
import {
  FeParentInfo,
  FeParentInfoSafe,
  FeSectionInfo,
  InfoS,
  noParentWarning,
  VarbInfo,
} from "../SectionsMeta/Info";
import {
  FeNameInfo,
  MultiFindByFocalInfo,
  MultiSectionInfo,
  RelSectionInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  UniqueIdMixedInfo,
  UniqueIdType,
} from "../SectionsMeta/relSections/rel/uniqueIdInfo";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import {
  ChildIdArrsWide,
  ChildName,
  DescendantIds,
  GeneralChildIdArrs,
  SelfAndDescendantIds,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import {
  ParentName,
  ParentNameSafe,
} from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterList } from "./GetterList";
import { GetterSections } from "./GetterSections";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export class GetterSection<
  SN extends SectionName = SectionName
> extends GetterSectionBase<SN> {
  private getterSections = new GetterSections(this.getterSectionsProps);
  get sections() {
    return this.getterSections;
  }
  get raw(): RawFeSection<SN> {
    return this.sectionsShare.sections.rawSection(this.feInfo);
  }
  get varbs(): GetterVarbs<SN> {
    return new GetterVarbs(this.getterSectionProps);
  }
  thisHasSectionName<S extends SectionName>(
    sectionName: S
  ): this is GetterSection<S> {
    return this.sectionName === (sectionName as any);
  }
  thisIsSectionType<ST extends SectionNameType>(
    sectionNameType: ST
  ): this is GetterSection<SectionName<ST>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
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
        if (this.thisHasSectionName(info.sectionName)) return this;
        else {
          throw new Error("Local section did not match the focal section.");
        }
      }
      // Parent can be one or none. For that reason,
      // it might better belong in the array category
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
        return this.getterSections.list(sectionName).arr;
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
  get meta(): SectionMeta<SN> {
    return this.getterSections.meta.section(this.sectionName);
  }
  get dbId(): string {
    return this.raw.dbId;
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
  get dbInfo(): DbSectionInfo<SN> {
    return {
      dbId: this.dbId,
      sectionName: this.sectionName,
    };
  }
  get feInfoMixed(): FeNameInfo<SN> {
    return {
      id: this.feId,
      idType: "feId",
      sectionName: this.sectionName,
    };
  }
  get siblingFeInfos(): FeSectionInfo<SN>[] {
    const siblingIds = this.parent.childFeIds(this.sectionName as any);
    return siblingIds.map((feId) => ({
      sectionName: this.sectionName,
      feId,
    }));
  }
  get siblings(): GetterSection<SN>[] {
    return this.siblingFeInfos.map((feInfo) => this.getterSection(feInfo));
  }
  onlyCousin<SN extends SectionName>(sectionName: SN): GetterSection<SN> {
    return this.parent.onlyChild(sectionName as any);
  }
  children<CN extends ChildName<SN>>(childName: CN): GetterSection<CN>[] {
    const childIds = this.childFeIds(childName);
    return childIds.map((feId) =>
      this.getterSection({ sectionName: childName, feId })
    );
  }
  childList<CN extends ChildName<SN>>(childName: CN): GetterList<CN> {
    return this.getterSections.list(childName);
  }
  childrenOldToYoung<CN extends ChildName<SN>>(
    childName: CN
  ): GetterSection<CN>[] {
    return this.childList(childName).filterByFeIds(this.childFeIds(childName));
  }
  onlyChild<CN extends ChildName<SN>>(childName: CN): GetterSection<CN> {
    const children = this.children(childName);
    if (children.length !== 1) {
      throw new Error(
        `There is not exactly one section with sectionName ${this.sectionName}.`
      );
    }
    return children[0];
  }
  onlyChildFeId<CN extends ChildName<SN>>(childName: CN): string {
    return this.onlyChild(childName).feId;
  }
  hasChild<CN extends ChildName<SN>>({
    sectionName,
    feId,
  }: FeSectionInfo<CN>): boolean {
    return this.childFeIds(sectionName).includes(feId);
  }
  hasChildByDbInfo<CN extends ChildName<SN>>({
    sectionName,
    dbId,
  }: DbSectionInfo<CN>): boolean {
    return this.childList(sectionName).hasByMixed({ idType: "dbId", id: dbId });
  }
  child<CN extends ChildName<SN>>({
    sectionName,
    feId,
  }: FeSectionInfo<CN>): GetterSection<CN> {
    return this.childList(sectionName).getByFeId(feId);
  }
  varb(varbName: string): GetterVarb<SN> {
    return this.varbs.one(varbName);
  }
  varbInfo(varbName: string): VarbInfo<SN> {
    return this.varb(varbName).feVarbInfo;
  }
  switchValue<SK extends SwitchEndingKey>(
    varbNameBase: string,
    switchEnding: SK
  ): SwitchTargetKey<SK> {
    const varbNames = switchNames(varbNameBase, switchEnding);
    const switchValue = this.value(varbNames.switch, "string");
    if (!(switchValue in varbNames) || switchValue === "switch")
      throw new Error(
        `switchValue of "${switchValue}" not a switch key: ${Object.keys(
          varbNames
        )}`
      );
    return switchValue as SwitchTargetKey<SK>;
  }
  switchVarbName(varbNameBase: string, switchEnding: SwitchEndingKey): string {
    const varbNames = switchNames(varbNameBase, switchEnding);
    const switchValue = this.switchValue(varbNameBase, switchEnding);
    return varbNames[switchValue as keyof typeof varbNames];
  }
  switchVarbInfo(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): VarbInfo<SN> {
    const varbName = this.switchVarbName(varbNameBase, switchEnding);
    return this.varbInfo(varbName);
  }
  switchVarb(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): GetterVarb<SN> {
    const varbName = this.switchVarbName(varbNameBase, switchEnding);
    return this.varb(varbName);
  }
  uniqueId<T extends UniqueIdType>(idType: T): string {
    return this[idType];
  }
  uniqueIdInfoMixed<T extends UniqueIdType>(
    idType: T
  ): UniqueIdMixedInfo<T, SN> {
    return {
      sectionName: this.sectionName,
      id: this.uniqueId(idType),
      idType,
    };
  }
  value<VT extends ValueTypeName | "any" = "any">(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.varb(varbName).value(valueType);
  }
  get selfAndDescendantVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantVarbInfos);
  }
  get selfAndDescendantVarbInfos(): VarbInfo[] {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.getterSection(sectionInfo);

      return feVarbInfos.concat(...section.varbs.feVarbInfos);
    }, [] as VarbInfo[]);
  }
  get selfAndDescendantSectionInfos(): FeSectionInfo[] {
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
  get allChildFeIds(): ChildIdArrsWide<SN> {
    return this.raw.childFeIds as GeneralChildIdArrs as ChildIdArrsWide<SN>;
  }
  childFeIds<CN extends ChildName<SN>>(childName: CN): string[] {
    const ids = this.allChildFeIds[childName];
    if (ids) return ids;
    else
      throw new Error(
        `"${childName}" is not a possible child section for ${this.sectionName}`
      );
  }
  get allChildDbIds(): ChildIdArrsWide<SN> {
    const { allChildFeIds } = this;
    return Obj.entries(allChildFeIds).reduce(
      (childDbIds, [sectionName, idArr]) => {
        const dbIds = idArr.map(
          (feId) => this.getterSections.section({ sectionName, feId }).dbId
        );
        childDbIds[sectionName] = dbIds;
        return childDbIds;
      },
      {} as ChildIdArrsWide<SN>
    );
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
  get parent(): GetterSection<ParentNameSafe<SN>> {
    const { parentNames } = this.meta.core;
    for (const parentName of parentNames) {
      const parentList = new GetterList({
        sectionsShare: this.sectionsShare,
        sectionName: parentName,
      });

      for (const parent of parentList.arr) {
        if (parent.hasChild(this.feInfo as any)) {
          return parent as any;
        }
      }
    }
    throw new Error(`parent not found for ${this.sectionName}.${this.feId}`);
  }
  get parentInfo(): FeParentInfo<SN> {
    return this.parent.feInfo;
  }
  get parentName(): ParentName<SN> {
    return this.parent.sectionName;
  }
  get parentInfoSafe(): FeParentInfoSafe<SN> {
    const { parentInfo } = this;
    if (parentInfo.sectionName === noParentWarning)
      throw new Error("This section doesn't have a parent.");
    return parentInfo as FeParentInfoSafe<SN>;
  }
  nearestAnscestor<S extends SectionName>(anscestorName: S): GetterSection<S> {
    let section = this as any as GetterSection;
    for (let i = 0; i < 100; i++) {
      if (section.sectionName === "main") {
        throw new Error(
          `An anscestor with sectionName ${anscestorName} was not found from sectionName ${this.sectionName}`
        );
      }
      const { parent } = section;
      if (anscestorName === parent.sectionName) {
        return parent as any as GetterSection<S>;
      }
      section = section.parent as any;
    }
    throw new Error("Neither anscestor nor main were found.");
  }
  getterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): GetterSection<S> {
    return new GetterSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
