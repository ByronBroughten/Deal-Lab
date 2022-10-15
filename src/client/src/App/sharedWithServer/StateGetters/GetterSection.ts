import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  DbSectionInfoMixed,
  FeSectionInfoMixed,
} from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  SectionValues,
  SectionValuesReq,
  SectionValuesRes,
  VarbValue,
} from "../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { SwitchTargetKey } from "../SectionsMeta/baseSectionsVarbs/baseSwitchNames";
import { InEntityInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { ValueName } from "../SectionsMeta/baseSectionsVarbs/baseVarb";
import { DbSectionInfo } from "../SectionsMeta/baseSectionsVarbs/DbSectionInfo";
import { ExpectedCount } from "../SectionsMeta/baseSectionsVarbs/NanoIdInfo";
import {
  SwitchEndingKey,
  switchNames,
} from "../SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import { ValueTypesPlusAny } from "../SectionsMeta/baseSectionsVarbs/StateVarbTypes";
import { ChildValueInfo } from "../SectionsMeta/childSectionsDerived/ChildInfo";
import {
  ChildIdArrsWide,
  ChildName,
  DbChildInfo,
  FeChildInfo,
  GeneralChildIdArrs,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import {
  DescendantIds,
  DescendantName,
  DescendantSectionName,
  SelfAndDescendantIds,
} from "../SectionsMeta/childSectionsDerived/DescendantSectionName";
import {
  mixedInfoS,
  SectionInfoMixedFocal,
  VarbInfoMixedFocal,
} from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import {
  ParentName,
  ParentNameSafe,
  PiblingName,
  SelfChildName,
  StepSiblingName,
} from "../SectionsMeta/childSectionsDerived/ParentName";
import { RelSectionInfo } from "../SectionsMeta/childSectionsDerived/RelInfo";
import {
  FeParentInfo,
  FeParentInfoSafe,
  FeSectionInfo,
  FeVarbInfo,
  noParentWarning,
} from "../SectionsMeta/Info";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionNameByType";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { PathDbIdInfo, PathInfo } from "./../SectionsMeta/PathInfo";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterList } from "./GetterList";
import { GetterSections } from "./GetterSections";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";
import { GetterVirtualVarb } from "./GetterVirtualVarb";

export class GetterSection<
  SN extends SectionNameByType = SectionNameByType
> extends GetterSectionBase<SN> {
  get sections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get list() {
    return new GetterList(this.getterListProps);
  }
  get packMaker() {
    return new PackMakerSection(this.getterSectionProps);
  }
  get raw(): RawFeSection<SN> {
    return this.sectionsShare.sections.rawSection(this.feInfo);
  }
  get varbs(): GetterVarbs<SN> {
    return new GetterVarbs(this.getterSectionProps);
  }
  get displayName(): string {
    return this.meta.displayName;
  }
  isOfSectionName<S extends SectionNameByType>(
    sectionName: S
  ): this is GetterSection<S> {
    return this.sectionName === (sectionName as any);
  }
  isSectionType<ST extends SectionNameType>(
    sectionNameType: ST
  ): this is GetterSection<SectionNameByType<ST>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
  varbByFocalMixed({ varbName, ...mixedInfo }: VarbInfoMixedFocal): GetterVarb {
    const section = this.sectionByFocalMixed(mixedInfo);
    return section.varb(varbName);
  }
  varbsByFocalMixed({
    varbName,
    ...mixedInfo
  }: VarbInfoMixedFocal): GetterVarb[] {
    const sections = this.sectionsByFocalMixed(mixedInfo);
    return sections.map((section) => section.varb(varbName));
  }
  sectionByFocalMixed(info: SectionInfoMixedFocal) {
    const sections = this.sectionsByFocalMixed(info);
    this.list.exactlyOneOrThrow(sections, info.infoType);
    return sections[0];
  }
  sectionsByFocalMixed(info: SectionInfoMixedFocal): GetterSection[] {
    switch (info.infoType) {
      case "feId":
      case "dbId":
      case "globalSection":
      case "absolutePath":
      case "absolutePathDbId": {
        return this.sections.sectionsByMixed(info);
      }
    }
    return this.sectionsByRelative(info);
  }
  sectionsByRelative(info: RelSectionInfo): GetterSection[] {
    const sections = this.allSectionsByRelative(info);
    if (info.expectedCount === "onlyOne") {
      this.list.exactlyOneOrThrow(sections, info.infoType);
    }
    return sections;
  }
  private allSectionsByRelative(info: RelSectionInfo): GetterSection<any>[] {
    switch (info.infoType) {
      case "local":
        return [this];
      case "parent":
        return [this.parent];
      case "children": {
        const { childName } = info;
        if (this.meta.isChildName(childName)) {
          return this.children(childName);
        } else {
          throw new Error(
            `"${childName}" is not a child of "${this.sectionName}"`
          );
        }
      }
      case "stepSibling": {
        const { stepSiblingName, stepSiblingSectionName } = info;
        const sectionName = this.parent.meta.childType(
          stepSiblingName as ChildName<any>
        );
        if (sectionName === stepSiblingSectionName) {
          return this.stepSiblings(stepSiblingName as StepSiblingName<SN>);
        } else {
          throw new Error(
            `sectionName ${sectionName} does not equal stepSiblingSectionName ${stepSiblingSectionName}`
          );
        }
      }
      case "pibling": {
        const { piblingName, piblingSectionName } = info;
        const sectionName = this.parent.parent.meta.childType(
          piblingName as ChildName<any>
        );
        if (sectionName === piblingSectionName) {
          return this.parent.stepSiblings(piblingName as PiblingName<SN>);
        } else
          throw new Error(
            `sectionName ${sectionName} does not equal piblingSectionName ${piblingSectionName}`
          );
      }
      case "stepSiblingOfHasChildName": {
        const { selfChildName, stepSiblingSectionName } = info;
        if (this.selfChildName === selfChildName) {
          return this.parent.childrenOfType(
            stepSiblingSectionName as ChildSectionName<any>
          );
        } else
          throw new Error(
            `selfChildName ${selfChildName} does not match this.selfChildName ${this.selfChildName}`
          );
      }
      case "niblingIfOfHasChildName": {
        const { niblingSectionName, selfChildName } = info;
        if (this.selfChildName === selfChildName) {
          return this.allStepSiblings.reduce((niblingsOfType, stepSibling) => {
            const nOfType = stepSibling.childrenOfType(
              niblingSectionName
            ) as GetterSection<any>[];
            return niblingsOfType.concat(nOfType);
          }, [] as GetterSection<any>[]);
        } else
          throw new Error(
            `selfChildName ${selfChildName} does not match this.selfChildName ${this.selfChildName}`
          );
      }
    }
  }
  childrenOfType<CSN extends ChildSectionName<SN>>(
    childSectionName: CSN
  ): GetterSection<CSN>[] {
    const childIds = this.childIdsOfType(childSectionName);
    return childIds.map((feId) =>
      this.getterSection({
        feId,
        sectionName: childSectionName,
      })
    );
  }
  stepSiblings(stepSiblingName: StepSiblingName<SN>): GetterSection<any>[] {
    const sectionName = this.parent.meta.childType(stepSiblingName);
    return this.allStepSiblingIds[stepSiblingName].map((feId) =>
      this.getterSection({
        feId,
        sectionName,
      })
    );
  }
  get allStepSiblingIds(): Record<StepSiblingName<SN>, string[]> {
    return this.parent.allChildFeIds;
  }
  get allStepSiblings(): GetterSection<any>[] {
    return this.allStepSiblingInfos.map((info) => this.getterSection(info));
  }
  get allStepSiblingInfos(): FeSectionInfo<any>[] {
    const { allStepSiblingIds } = this;
    return Obj.keys(allStepSiblingIds).reduce((infos, stepSiblingName) => {
      const sectionName = this.parent.meta.childType(stepSiblingName);
      const feIds = allStepSiblingIds[stepSiblingName];
      return infos.concat(feIds.map((feId) => ({ sectionName, feId })));
    }, [] as FeSectionInfo<any>[]);
  }

  get meta(): SectionMeta<SN> {
    return this.sections.meta.section(this.sectionName);
  }
  get dbId(): string {
    return this.raw.dbId;
  }
  get idx() {
    return this.sections.list(this.sectionName).idx(this.feId);
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
  dbInfoMixed<EC extends ExpectedCount>(
    expectedCount: EC
  ): DbSectionInfoMixed<SN, EC> {
    return mixedInfoS.makeDb(this.sectionName, this.dbId, expectedCount);
  }
  get feInfoMixed(): FeSectionInfoMixed<SN> {
    return mixedInfoS.makeFe(this.sectionName, this.feId);
  }
  get selfChildName(): SelfChildName<SN> {
    const { allChildFeIds } = this.parent;
    for (const childName of Obj.keys(allChildFeIds)) {
      if (allChildFeIds[childName].includes(this.feId)) {
        return childName;
      }
    }
    throw new Error("this.feId was not found in this.parent.allChildFeIds");
  }
  get siblingFeInfos(): FeSectionInfo<SN>[] {
    const siblingIds = this.parent.childFeIds(this.selfChildName);
    return siblingIds.map((feId) => ({
      sectionName: this.sectionName,
      feId,
    }));
  }
  get siblings(): GetterSection<SN>[] {
    return this.siblingFeInfos.map((feInfo) => this.getterSection(feInfo));
  }
  onlyCousin<S extends SectionNameByType>(sectionName: S): GetterSection<S> {
    return this.parent.onlyChild(sectionName as any) as any as GetterSection<S>;
  }
  children<CN extends ChildName<SN>>(
    childName: CN
  ): GetterSection<ChildSectionName<SN, CN>>[] {
    const childIds = this.childFeIds(childName);
    return childIds.map((feId) =>
      this.getterSection({
        sectionName: this.meta.childType(childName),
        feId,
      })
    ) as any;
  }
  childByDbId<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
  >({ childName, dbId }: DbChildInfo<SN, CN>): GetterSection<CT> {
    let children = this.children(childName);
    children = children.filter((child) => child.dbId === dbId);
    this.list.exactlyOneOrThrow(children, "dbId");
    return children[0] as GetterSection<CT>;
  }
  childList<CN extends ChildName<SN>, CT extends ChildSectionName<SN, CN>>(
    childName: CN
  ): GetterList<CT> {
    const childSn = this.meta.childType(childName);
    return this.sections.list(childSn) as any;
  }
  childrenOldToYoung<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >(childName: CN): GetterSection<CT>[] {
    const feIds = this.childFeIds(childName);
    return (this.childList(childName) as GetterList<CT>).filterByFeIds(feIds);
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): GetterSection<ChildSectionName<SN, CN>> {
    const children = this.children(childName);
    this.list.exactlyOneOrThrow(
      children,
      `${this.sectionName}.${this.feId}.${childName}`
    );
    return children[0];
  }
  onlyChildFeId<CN extends ChildName<SN>>(childName: CN): string {
    return this.onlyChild(childName).feId;
  }
  sectionIsChild<CT extends ChildSectionName<SN>>(
    feInfo: FeSectionInfo
  ): feInfo is FeSectionInfo<CT> {
    const { sectionName, feId } = feInfo;
    if (this.meta.isChildType(sectionName)) {
      const childIds = this.childIdsOfType(sectionName);
      return childIds.includes(feId);
    } else return false;
  }
  sectionChildName(feInfo: FeSectionInfo): ChildName<SN> {
    if (this.sectionIsChild(feInfo)) {
      const { sectionName, feId } = feInfo;
      const childNames = this.meta.childTypeNames(sectionName);
      for (const childName of childNames) {
        const feIds = this.childFeIds(childName);
        if (feIds.includes(feId)) return childName;
      }
    }
    const { sectionName, feId } = feInfo;
    throw new Error(`Child at ${sectionName}.${feId} was not found.`);
  }
  hasOnlyChild<CN extends ChildName<SN>>(childName: CN): boolean {
    if (this.childFeIds(childName).length > 1) {
      throw this.list.tooManySectionsFound("onlyChild");
    }
    return this.childFeIds(childName).length === 1;
  }
  hasChild<CN extends ChildName<SN>>({
    childName,
    feId,
  }: FeChildInfo<SN, CN>): boolean {
    return this.childFeIds(childName).includes(feId);
  }
  hasChildByDbInfo<CN extends ChildName<SN>>({
    childName,
    dbId,
  }: DbChildInfo<SN, CN>): boolean {
    const child = this.children(childName).find((child) => child.dbId === dbId);
    if (child) return true;
    else return false;
  }
  hasChildByValue<
    CN extends ChildName<SN>,
    VN extends VarbName<ChildSectionName<SN, CN>>
  >(props: ChildValueInfo<SN, CN, VN>): boolean {
    const children = this.childrenByValue(props);
    if (children.length > 0) return true;
    else return false;
  }
  childrenByValue<
    CN extends ChildName<SN>,
    VN extends VarbName<ChildSectionName<SN, CN>>
  >({
    childName,
    varbName,
    value,
  }: ChildValueInfo<SN, CN, VN>): GetterSection<ChildSectionName<SN, CN>>[] {
    return this.children(childName).filter(
      (child) => child.valueNext(varbName) === value
    );
  }
  childToFeInfo<CN extends ChildName<SN>>({
    childName,
    ...rest
  }: FeChildInfo<SN, CN>): FeSectionInfo<ChildSectionName<SN, CN>> {
    const sectionName = this.meta.childType(childName);
    return { sectionName, ...rest };
  }
  child<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
  >(childInfo: FeChildInfo<SN, CN>): GetterSection<CT> {
    const feInfo = this.childToFeInfo(childInfo) as FeSectionInfo<CT>;
    return this.getterSection(feInfo);
  }
  childInfoToFe<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
  >({ childName, feId }: FeChildInfo<SN, CN>): FeSectionInfo<CT> {
    const sectionName = this.meta.childType(childName) as CT;
    return { sectionName, feId };
  }
  varb(varbName: string): GetterVarb<SN> {
    return new GetterVarb({
      ...this.feSectionInfo,
      sectionsShare: this.sectionsShare,
      varbName,
    });
  }
  varbNext<VN extends VarbName<SN>>(varbName: VN): GetterVarb<SN> {
    return this.varb(varbName as string);
  }
  varbInfo(varbName: VarbName<SN>): FeVarbInfo<SN> {
    return this.varb(varbName as string).feVarbInfo;
  }
  get allValues(): SectionValues<SN> {
    return this.meta.varbNames.reduce((values, varbName) => {
      (values[varbName as VarbName<SN>] as any) = this.value(varbName);
      return values;
    }, {} as SectionValues<SN>);
  }
  values<VNS extends SectionValuesReq>(
    varbToValuesNames: VNS
  ): SectionValuesRes<VNS> {
    return Obj.keys(varbToValuesNames).reduce((values, varbName) => {
      values[varbName] = this.value(varbName, varbToValuesNames[varbName]);
      return values;
    }, {} as SectionValuesRes<VNS>);
  }
  get virtualVarb(): GetterVirtualVarb<SN> {
    return new GetterVirtualVarb(this.getterSectionProps);
  }
  valueInEntityInfo(): InEntityInfo {
    const value = this.value("valueEntityInfo", "inEntityInfo");
    if (!value) throw new Error("inEntityInfo value is not initialized");
    return value;
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
  ): FeVarbInfo<SN> {
    const varbName = this.switchVarbName(
      varbNameBase,
      switchEnding
    ) as VarbName<SN>;
    return this.varbInfo(varbName);
  }
  switchVarb(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): GetterVarb<SN> {
    const varbName = this.switchVarbName(varbNameBase, switchEnding);
    return this.varb(varbName);
  }
  value<VT extends ValueName | "any" = "any">(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.varb(varbName).value(valueType);
  }
  valueNext<VN extends VarbName<SN>>(varbName: VN): VarbValue<SN, VN> {
    return this.varb(varbName as string).valueNext() as VarbValue<SN, VN>;
  }
  get selfAndDescendantVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantVarbInfos);
  }
  get selfAndDescendantVarbInfos(): FeVarbInfo[] {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.getterSection(sectionInfo);
      return feVarbInfos.concat(...section.varbs.feVarbInfos);
    }, [] as FeVarbInfo[]);
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
  hasChildName(str: string): str is ChildName<SN> {
    return this.meta.isChildName(str);
  }
  get childNames(): ChildName<SN>[] {
    return this.meta.childNames;
  }

  get allChildFeIds(): ChildIdArrsWide<SN> {
    return this.raw.childFeIds as GeneralChildIdArrs as ChildIdArrsWide<SN>;
  }
  childIdsOfType<CT extends ChildSectionName<SN>>(sectionName: CT): string[] {
    const childNames = this.meta.childTypeNames(sectionName);
    return childNames.reduce((ids, childName) => {
      return [...ids, ...this.childFeIds(childName)];
    }, [] as string[]);
  }
  childFeIds<CN extends ChildName<SN>>(childName: CN): string[] {
    const ids = this.allChildFeIds[childName];
    if (ids) return ids;
    else {
      throw this.isNotValidChildNameError(childName);
    }
  }

  childrenDbIds<CN extends ChildName<SN>>(childName: CN): string[] {
    return this.children(childName).map(({ dbId }) => dbId);
  }
  get allChildDbIds(): ChildIdArrsWide<SN> {
    const { allChildFeIds } = this;
    return Obj.entries(allChildFeIds).reduce(
      (allChildDbIds, [childName, idArr]) => {
        const sectionName = this.meta.childType(childName);
        const dbIds = idArr.map(
          (feId) => this.sections.section({ sectionName, feId }).dbId
        );
        allChildDbIds[childName] = dbIds;
        return allChildDbIds;
      },
      {} as ChildIdArrsWide<SN>
    );
  }
  getDescendants(
    descendantNames: DescendantName<SN>[]
  ): GetterSection<DescendantSectionName<SN>>[] {
    let section: GetterSection<any> = this;
    for (let idx = 0; idx < descendantNames.length; idx++) {
      const name = descendantNames[idx];
      if (section.hasChildName(name)) {
        if (Arr.isLastIdx(descendantNames, idx)) {
          return section.children(name);
        } else {
          section = section.onlyChild(name);
        }
      } else {
        throw section.isNotValidChildNameError(name);
      }
    }
    throw new Error("Arr.isLastIdx never returned true");
  }
  getOnlyDescendant(
    descendantNames: DescendantName<SN>[]
  ): GetterSection<DescendantSectionName<SN>> {
    const sections = this.getDescendants(descendantNames);
    this.list.exactlyOneOrThrow(sections, "descendantNames");
    return sections[0];
  }
  hasDescendantByPathInfo<S extends SectionName>(
    pathInfo: PathInfo<S>
  ): boolean {
    return this.descendantsByPathInfo(pathInfo).length > 0;
  }
  descendantsByPathInfo<S extends SectionName>({
    sectionPath,
    sectionName,
  }: PathInfo<S>): GetterSection<S>[] {
    const sections = this.getDescendants(sectionPath as DescendantName<SN>[]);
    sections.forEach((section) => {
      if (!section.isOfSectionName(sectionName)) {
        throw section.notOfSectionNameError(sectionName);
      }
    });
    return sections as GetterSection<any>[];
  }
  descendantByPathInfo<S extends SectionName>(
    pathInfo: PathInfo<S>
  ): GetterSection<S> {
    const descendants = this.descendantsByPathInfo(pathInfo);
    this.list.exactlyOneOrThrow(descendants, "pathInfo");
    return descendants[0];
  }
  notOfSectionNameError(wrongName: string) {
    return new Error(
      `"${wrongName}" does not match sectionName of ${this.sectionName}`
    );
  }
  isNotValidChildNameError(wrongName: string) {
    return new Error(
      `"${wrongName}" is not a childName of ${this.sectionName}`
    );
  }
  descendantsByPathAndDbId<S extends SectionName>({
    dbId,
    ...rest
  }: PathDbIdInfo<S>): GetterSection<S>[] {
    const sections = this.descendantsByPathInfo(rest);
    return sections.filter((section) => section.dbId === dbId);
  }
  descendantByPathAndDbId<S extends SectionName>(
    pathInfo: PathDbIdInfo<S>
  ): GetterSection<S> {
    const sections = this.descendantsByPathAndDbId(pathInfo);
    this.list.exactlyOneOrThrow(sections, "pathDbIdInfo");
    return sections[0];
  }
  hasDescendantByPathAndDbId<S extends SectionName>(
    pathInfo: PathDbIdInfo<S>
  ): boolean {
    return this.descendantsByPathAndDbId(pathInfo).length > 0;
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
          const childSn = section.meta.childType(childName);
          if (!(childSn in descendantIds)) descendantIds[childSn] = [];
          section.childFeIds(childName).forEach((feId) => {
            if (!descendantIds[childSn].includes(feId)) {
              descendantIds[childSn].push(feId);
            }
          });
          queue.push(...section.childTypeInfos(childName));
        }
      }
    }
    return descendantIds as any;
  }
  childTypeInfos<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
  >(childName: CN): FeSectionInfo<CT>[] {
    const childFeIds = this.childFeIds(childName);
    const sectionName = this.meta.childType(childName);
    return childFeIds.map(
      (feId) =>
        ({
          sectionName,
          feId,
        } as FeSectionInfo<CT>)
    );
  }
  youngestChild<CN extends ChildName<SN>, CT extends ChildSectionName<SN, CN>>(
    childName: CN
  ): GetterSection<CT> {
    const children = this.childrenOldToYoung(childName) as GetterSection<CT>[];
    return Arr.lastOrThrow(children);
  }
  isChildNameOrThrow(childName: any): childName is ChildName<SN> {
    if (!this.meta.isChildName(childName)) {
      throw new Error(`${childName} is not a child of ${this.sectionName}`);
    } else return true;
  }
  get parent(): GetterSection<ParentNameSafe<SN>> {
    const { parentNames } = this.meta;
    for (const parentName of parentNames) {
      const parentList = new GetterList({
        sectionsShare: this.sectionsShare,
        sectionName: parentName,
      });

      for (const parent of parentList.arr) {
        if (parent.sectionIsChild(this.feInfo)) {
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
  nearestAnscestor<S extends SectionNameByType>(
    anscestorName: S
  ): GetterSection<S> {
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
  getterSection<S extends SectionNameByType>(
    feInfo: FeSectionInfo<S>
  ): GetterSection<S> {
    return new GetterSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
