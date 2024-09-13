import { SectionValuesGeneric } from "../State/RawSection";
import {
  ContextPathIdxSpecifier,
  RawFeSection,
  SectionNotFoundError,
  TooManySectionsFoundError,
} from "../State/StateSectionsTypes";
import { PackMakerSection } from "../StateOperators/Packers/PackMakerSection";
import {
  GroupBaseVI,
  GroupVarbNameBase,
} from "../stateSchemas/fromSchema3SectionStructures/baseGroupNames";
import { VarbName } from "../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import {
  ChildIdArrsWide,
  ChildName,
  DbChildInfo,
  DescendantIds,
  FeChildInfo,
  GeneralChildIdArrs,
} from "../stateSchemas/fromSchema6SectionChildren/ChildName";
import { ChildSectionName } from "../stateSchemas/fromSchema6SectionChildren/ChildSectionName";
import {
  DescendantOfSnByNodeInfo,
  DescendantOfSnInfo,
  DescOfSnDbIdInfo,
} from "../stateSchemas/fromSchema6SectionChildren/DescendantName";
import {
  noParentWarning,
  ParentName,
  ParentNameSafe,
  PiblingName,
  SelfChildName,
  StepSiblingName,
} from "../stateSchemas/fromSchema6SectionChildren/ParentName";
import { ValueName } from "../stateSchemas/schema1ValueNames";
import { SectionName } from "../stateSchemas/schema2SectionNames";
import { DbSectionInfo } from "../stateSchemas/schema3SectionStructures/DbSectionInfo";
import {
  GroupKey,
  periodicName,
  timespanName,
} from "../stateSchemas/schema3SectionStructures/GroupName";
import {
  SectionValues,
  StateValue,
  StateValueOrAny,
  ValueNameOrAny,
  VarbValue,
} from "../stateSchemas/schema4ValueTraits/StateValue";
import { InEntityValue } from "../stateSchemas/schema4ValueTraits/StateValue/InEntityValue";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "../stateSchemas/schema6SectionChildren/SectionNameByType";
import { GenericChildTraits } from "../stateSchemas/schema8ChildrenTraits";
import { SectionPack } from "../StateTransports/SectionPack";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "./Bases/GetterSectionBase";
import { GetterSectionsRequiredProps } from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSections } from "./GetterSections";
import { GetterVarb } from "./GetterVarb";
import {
  AbsolutePathNodeDbIdInfo,
  AbsolutePathNodeInfoMixed,
} from "./Identifiers/AbsolutePathInfo";
import { ChildValueInfo } from "./Identifiers/ChildInfo";
import {
  FeParentInfo,
  FeParentInfoSafe,
  FeSectionInfo,
  FeVarbInfo,
  FeVarbInfoNext,
} from "./Identifiers/FeInfo";
import {
  mixedInfoS,
  SectionInfoMixedFocal,
  VarbInfoMixedFocal,
} from "./Identifiers/MixedSectionInfo";
import { RelSectionInfo } from "./Identifiers/RelInfo";
import { SectionId } from "./Identifiers/SectionId";
import { sectionPathContexts } from "./Identifiers/sectionPaths/sectionPathContexts";
import {
  AbsolutePathNode,
  pathSectionName,
  SectionPathName,
} from "./Identifiers/sectionPaths/sectionPathNames";
import { StoreId } from "./Identifiers/StoreId";
import {
  DbSectionInfoMixed,
  FeSectionInfoMixed,
} from "./Identifiers/VarbInfoBase";
import { getVarbPathParams } from "./Identifiers/VarbPathNameInfo";
import { SectionMeta } from "./StateMeta/SectionMeta";

export interface GetterSectionRequiredProps<SN extends SectionName>
  extends FeSectionInfo<SN>,
    GetterSectionsRequiredProps {}

type GetterVarbs<SN extends SectionName> = Record<VarbName<SN>, GetterVarb<SN>>;

export class GetterSection<
  SN extends SectionName = SectionName
> extends GetterSectionBase<SN> {
  static initSectionProps<SN extends SectionName>(
    props: GetterSectionRequiredProps<SN>
  ): GetterSectionProps<SN> {
    return {
      ...this.initProps(props),
      ...props,
    };
  }
  get sections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get list() {
    return new GetterList(this.getterListProps);
  }
  get calculatedFocal(): GetterSection<"calculatedVarbs"> {
    return this.sectionByFocalMixed({
      infoType: "pathName",
      pathName: "calculatedVarbsFocal",
    }) as GetterSection<"calculatedVarbs">;
  }
  get packMaker() {
    return new PackMakerSection(this.getterSectionProps);
  }
  get raw(): RawFeSection<SN> {
    return this.sectionsShare.sections.rawSection(this.feInfo);
  }
  get selfChildTraits(): GenericChildTraits {
    return this.parent.meta.childTraits(this.selfChildName);
  }
  get mainStoreName() {
    const { mainStoreName } = this.selfChildTraits;
    if (mainStoreName) {
      return mainStoreName;
    } else {
      return this.meta.defaultStoreName;
    }
  }
  hasVarbName(varbName: string): boolean {
    return this.meta.hasVarbName(varbName);
  }
  get varbs(): GetterVarbs<SN> {
    return this.meta.varbNamesNext.reduce((varbs, varbName) => {
      varbs[varbName] = new GetterVarb({
        ...this.getterSectionProps,
        varbName: varbName as string,
      });
      return varbs;
    }, {} as GetterVarbs<SN>);
  }
  get varbArr(): GetterVarb<SN>[] {
    return this.meta.varbNamesNext.map((varbName) => this.varbNext(varbName));
  }
  get displayName(): string {
    return this.meta.displayName;
  }
  isOfSectionName<S extends SectionName>(
    ...sectionNames: S[]
  ): this is GetterSection<S> {
    return sectionNames.includes(this.sectionName as any);
  }
  isSectionType<ST extends SectionNameType>(
    sectionNameType: ST
  ): this is GetterSection<SectionNameByType<ST>> {
    return sectionNameS.is(this.sectionName, sectionNameType);
  }
  varbByFocalMixed(mixedInfo: VarbInfoMixedFocal): GetterVarb {
    const { sectionInfo, varbName } = this.sectionAndVarbInfo(mixedInfo);
    const section = this.sectionByFocalMixed(sectionInfo);
    return section.varb(varbName);
  }
  hasVarbByFocalMixed(mixedInfo: VarbInfoMixedFocal): boolean {
    const { sectionInfo, varbName } = this.sectionAndVarbInfo(mixedInfo);
    if (this.hasSectionByFocalMixed(sectionInfo)) {
      const section = this.sectionByFocalMixed(sectionInfo);
      return section.meta.isVarbName(varbName);
    }
    return false;
  }
  private sectionAndVarbInfo(mixedInfo: VarbInfoMixedFocal): {
    varbName: string;
    sectionInfo: SectionInfoMixedFocal;
  } {
    if (mixedInfo.infoType === "varbPathName") {
      const { pathName, varbName } = getVarbPathParams(mixedInfo.varbPathName);
      return {
        varbName,
        sectionInfo: {
          infoType: "pathName",
          pathName,
        },
      };
    } else if (mixedInfo.infoType === "varbPathDbId") {
      const { pathName, varbName } = getVarbPathParams(mixedInfo.varbPathName);
      return {
        varbName,
        sectionInfo: {
          infoType: "pathNameDbId",
          pathName,
          id: mixedInfo.dbId,
        },
      };
    } else {
      const { varbName, ...sectionInfo } = mixedInfo;
      return {
        varbName,
        sectionInfo,
      };
    }
  }
  varbsByFocalMixed(mixedInfo: VarbInfoMixedFocal): GetterVarb[] {
    const { varbName, sectionInfo } = this.sectionAndVarbInfo(mixedInfo);
    const sections = this.sectionsByFocalMixed(sectionInfo);
    return sections.map((section) => section.varb(varbName));
  }
  sectionByFocalMixed(info: SectionInfoMixedFocal): GetterSection {
    const sections = this.sectionsByFocalMixed(info);
    if (info.infoType === "pathName" || info.infoType === "pathNameDbId") {
      this.oneOrThrowByPathNameError(sections, info.pathName);
    } else if (info.infoType === "children") {
      this.oneOrThrowChildError(sections, info.childName);
    } else if (info.infoType === "firstChild") {
      if (sections.length < 1) {
        this.oneOrThrowChildError(sections, info.childName);
      }
    } else {
      this.list.exactlyOneOrThrow(sections, info.infoType);
    }
    return sections[0];
  }
  private noSectionByPathError(pathName: SectionPathName): Error {
    return new Error(`No section found using pathName ${pathName}`);
  }
  private tooManySectionsByPathError(pathName: SectionPathName): Error {
    return new Error(`Too many sections at pathName ${pathName}`);
  }
  oneOrThrowByPathNameError(sections: any[], pathName: SectionPathName): void {
    if (sections.length > 1) {
      throw this.tooManySectionsByPathError(pathName);
    } else if (sections.length < 1) {
      throw this.noSectionByPathError(pathName);
    }
  }
  hasSectionByFocalMixed(info: SectionInfoMixedFocal) {
    const sections = this.sectionsByFocalMixed(info);
    if (sections.length === 0) return false;
    this.list.exactlyOneOrThrow(sections, info.infoType);
    return true;
  }
  sectionsByFocalMixed(info: SectionInfoMixedFocal): GetterSection[] {
    switch (info.infoType) {
      case "feId":
      case "dbId":
      case "globalSection":
      case "absolutePath":
      case "absolutePathDbId":
      case "absolutePathNode":
      case "absolutePathNodeDbId": {
        return this.sections.sectionsByMixed(info);
      }
      case "varbPathName":
      case "varbPathDbId": {
        const { varbPathName, ...rest } = info;
        const { pathName } = getVarbPathParams(varbPathName);
        const sectionName = pathSectionName(pathName);
        const pathNodes = this.getPathNodesFromContext(pathName);
        if (rest.infoType === "varbPathName") {
          const absoluteInfo: AbsolutePathNodeInfoMixed = {
            sectionName,
            pathNodes,
            infoType: "absolutePathNode",
          };
          return this.sections.sectionsByMixed(absoluteInfo);
        } else if (rest.infoType === "varbPathDbId") {
          const info: AbsolutePathNodeDbIdInfo = {
            dbId: rest.dbId,
            pathNodes,
            infoType: "absolutePathNodeDbId",
            sectionName,
          };
          return this.sections.sectionsByMixed(info);
        } else {
          throw new Error("This shouldn't happen");
        }
      }
      case "pathName":
      case "pathNameDbId": {
        const { pathName, ...rest } = info;
        const sectionName = pathSectionName(pathName);
        const pathNodes = this.getPathNodesFromContext(pathName);
        if (rest.infoType === "pathName") {
          const info: AbsolutePathNodeInfoMixed = {
            sectionName,
            pathNodes,
            infoType: "absolutePathNode",
          };
          return this.sections.sectionsByMixed(info);
        } else if (rest.infoType === "pathNameDbId") {
          const info: AbsolutePathNodeDbIdInfo = {
            dbId: rest.id,
            pathNodes,
            infoType: "absolutePathNodeDbId",
            sectionName,
          };
          return this.sections.sectionsByMixed(info);
        } else throw new Error("This shouldn't happen.");
      }
      default: {
        return this.sectionsByRelative(info);
      }
    }
  }
  sectionsByRelative(info: RelSectionInfo): GetterSection[] {
    const sections = this.allSectionsByRelative(info);
    return sections;
  }
  private allSectionsByRelative(info: RelSectionInfo): GetterSection<any>[] {
    switch (info.infoType) {
      case "local":
        return [this];
      case "parent":
        return [this.parent];
      case "firstChild": {
        const { childName } = info;
        if (this.meta.isChildName(childName)) {
          const children = this.children(childName);
          if (children.length === 0) {
            this.oneOrThrowChildError(children, childName);
          } else {
            return [children[0]];
          }
        } else {
          throw new Error(
            `"${childName}" is not a child of "${this.sectionName}"`
          );
        }
      }
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
  numObjOrNotFoundByMixedAssertOne(info: VarbInfoMixedFocal): string {
    if (this.hasVarbByFocalMixed(info)) {
      return this.varbByFocalMixed(info).displayVarb();
    } else return "Not Found";
  }
  childrenOfType<CSN extends ChildSectionName<SN>>(
    sectionChildName: CSN
  ): GetterSection<CSN>[] {
    const childIds = this.childIdsOfType(sectionChildName);
    return childIds.map((feId) =>
      this.getterSection({
        feId,
        sectionName: sectionChildName,
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
  makeSectionPack(): SectionPack<SN> {
    return this.packMaker.makeSectionPack();
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
  get mainStoreId() {
    return StoreId.make(this.mainStoreName, this.feId);
  }
  get sectionId() {
    return SectionId.make(this.sectionName, this.feId);
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
  get contextPathIdxSpecifier(): ContextPathIdxSpecifier {
    return this.raw.contextPathIdxSpecifier;
  }
  get sectionContextName() {
    return this.raw.sectionContextName;
  }
  private getPathNodesFromContext(
    pathName: SectionPathName
  ): AbsolutePathNode[] {
    const path = this.getPathFromContext(pathName);
    const idxSpecifiers = this.contextPathIdxSpecifier;
    const strIdxs = Obj.keys(idxSpecifiers) as string[];
    const idxs = strIdxs.map((str) => parseInt(str));
    return path.map((childName, idx): AbsolutePathNode => {
      if (idxs.includes(idx)) {
        const specifier = idxSpecifiers[idx];
        if (specifier.selfChildName === childName) {
          return {
            childName,
            feId: specifier.feId,
          };
        }
      }
      return { childName };
    });
  }
  private getPathFromContext(pathName: SectionPathName): ChildName[] {
    const path = sectionPathContexts[this.sectionContextName][pathName][
      "path"
    ] as ChildName[];
    return path;
  }
  dbInfoMixed(): DbSectionInfoMixed<SN> {
    return mixedInfoS.makeDb(this.sectionName, this.dbId);
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
  childCount(childName: ChildName<SN>): number {
    return this.children(childName).length;
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
    this.oneOrThrowChildError(children, childName);
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
    this.oneOrThrowChildError(children, childName);
    return children[0];
  }
  oneOrThrowChildError(arr: any[], childName: string): void {
    if (arr.length > 1) {
      throw this.tooManyChildrenError(childName);
    } else if (arr.length < 1) {
      throw this.noChildError(childName);
    }
  }
  tooManyChildrenError(childName: string): TooManySectionsFoundError {
    return new TooManySectionsFoundError(
      `${this.sectionName} has too many children of childName ${childName}`
    );
  }
  noChildError(childName: string): SectionNotFoundError {
    return new SectionNotFoundError(
      `${this.sectionName} has no children of childName ${childName}`
    );
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
      throw new Error(
        `${this.sectionName} has too many children of childName ${childName}`
      );
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
  get getterSectionProps(): GetterSectionProps<SN> {
    return {
      ...this.getterListProps,
      feId: this.feId,
    };
  }
  varb(varbName: string): GetterVarb<SN> {
    return new GetterVarb({
      ...this.getterSectionProps,
      varbName,
    });
  }
  varbNext<VN extends VarbName<SN>>(varbName: VN): GetterVarb<SN> {
    return this.varb(varbName as string);
  }
  timespanVBI<BN extends GroupVarbNameBase<"timespan", SN>>(
    varbBaseName: BN
  ): GroupBaseVI<"timespan", SN> {
    return {
      ...this.feInfo,
      varbBaseName,
    };
  }
  timespanVarb<
    BN extends GroupVarbNameBase<"timespan", SN>,
    GK extends GroupKey<"timespan">
  >(baseName: BN, groupKey: GK): GetterVarb<SN> {
    return this.varb(timespanName(baseName, groupKey) as string);
  }
  periodicVBI<BN extends GroupVarbNameBase<"periodic", SN>>(
    varbBaseName: BN
  ): GroupBaseVI<"periodic", SN> {
    return {
      ...this.feInfo,
      varbBaseName,
    };
  }
  periodicVarb<
    BN extends GroupVarbNameBase<"periodic", SN>,
    GK extends GroupKey<"periodic">
  >(baseName: BN, groupKey: GK): GetterVarb<SN> {
    return this.varb(periodicName(baseName, groupKey) as string);
  }
  stringValue<VN extends VarbName<SN>>(varbName: VN): string {
    return this.varbNext(varbName).stringValue;
  }
  displayVarb<VN extends VarbName<SN>>(varbName: VN): string {
    return this.varbNext(varbName).displayVarb();
  }
  varbInfo(varbName: VarbName<SN>): FeVarbInfo<SN> {
    return this.varb(varbName as string).feVarbInfo;
  }
  varbInfo2<VN extends VarbName<SN>>(varbName: VN): FeVarbInfoNext<SN, VN> {
    return this.varb(varbName).feVarbInfo as FeVarbInfoNext<SN, VN>;
  }
  varbInfoArr(...varbNames: VarbName<SN>[]): FeVarbInfo<SN>[] {
    return varbNames.map((varbName) => this.varbInfo(varbName));
  }
  get allValues(): SectionValues<SN> {
    return this.meta.varbNames.reduce((values, varbName) => {
      (values[varbName as VarbName<SN>] as any) = this.value(varbName);
      return values;
    }, {} as SectionValues<SN>);
  }
  get sectionValues(): SectionValuesGeneric {
    return this.allValues as SectionValuesGeneric;
  }
  values<VNS extends SectionValuesReq>(
    varbToValuesNames: VNS
  ): SectionValuesRes<VNS> {
    return Obj.keys(varbToValuesNames).reduce((values, varbName) => {
      values[varbName] = this.value(varbName, varbToValuesNames[varbName]);
      return values;
    }, {} as SectionValuesRes<VNS>);
  }
  valueEntityInfo(): Exclude<InEntityValue, null> {
    const value = this.value("valueEntityInfo", "inEntityValue");
    if (!value) throw new Error("inEntityValue value is not initialized");
    return value;
  }
  value<VT extends ValueNameOrAny = "any">(
    varbName: string,
    valueType?: VT
  ): StateValueOrAny<VT> {
    return this.varb(varbName).value(valueType);
  }
  valueNext<VN extends VarbName<SN>>(varbName: VN): VarbValue<SN, VN> {
    return this.varb(varbName as string).valueNext() as VarbValue<SN, VN>;
  }
  numValue<VN extends VarbName<SN>>(varbName: VN): number {
    return this.varbNext(varbName).numberValue;
  }
  valueSafe<VN extends VarbName<SN>, AV extends any>(
    varbName: VN,
    acceptedValues: readonly AV[]
  ): AV {
    const varb = this.varbNext(varbName);
    return varb.valueSafe(acceptedValues);
  }
  checkInputValue<VN extends VarbName<SN>>(
    varbName: VN
  ): { isEmpty: boolean; isValid: boolean } {
    const value = this.value(varbName as string, "numObj");
    if (!value.mainText)
      return {
        isEmpty: true,
        isValid: false,
      };
    else
      return {
        isEmpty: false,
        isValid: true,
      };
  }
  get selfAndDescendantVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantVarbInfos);
  }
  get feVarbInfos(): FeVarbInfo<SN>[] {
    const { feSectionInfo } = this;
    return this.meta.varbNames.map(
      (varbName) =>
        ({
          ...feSectionInfo,
          varbName,
        } as FeVarbInfo<SN>)
    );
  }
  get selfAndDescendantVarbInfos(): FeVarbInfo[] {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.getterSection(sectionInfo);
      return feVarbInfos.concat(...section.feVarbInfos);
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
  get selfAndDescendantFeIds(): DescendantIds {
    const { feId, sectionName } = this;
    const descendantIds = this.descendantFeIds();
    return {
      [sectionName]: [feId] as string[],
      ...descendantIds,
    };
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
  get allChildren(): GetterChildren<SN> {
    return this.childNames.reduce((children, childName) => {
      children[childName] = [];
      for (const feId of this.childFeIds(childName)) {
        children[childName].push(
          this.child({
            childName,
            feId,
          })
        );
      }
      return children;
    }, {} as GetterChildren<SN>);
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
  oneChildFeId(childName: ChildName<SN>): string {
    const ids = this.childFeIds(childName);
    if (ids.length !== 1) {
      throw new Error(
        `Here, section "${this.sectionName}" should have exactly one of this child, "${childName}, but has ${ids.length}".`
      );
    }
    return ids[0];
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
  getDescendants(descendantNames: ChildName[]): GetterSection[] {
    let descendants: GetterSection<any>[] = [];
    let sections: GetterSection<any>[] = [this];
    for (let idx = 0; idx < descendantNames.length; idx++) {
      const name = descendantNames[idx];
      for (const section of sections) {
        if (section.hasChildName(name)) {
          descendants.push(...section.children(name));
        } else {
          throw section.isNotValidChildNameError(name);
        }
      }
      if (!Arr.isLastIdx(descendantNames, idx)) {
        sections = descendants;
        descendants = [];
      }
    }
    return descendants;
  }
  getDescendantsByNode(descendantNodes: AbsolutePathNode[]): GetterSection[] {
    let descendants: GetterSection<any>[] = [];
    let sections: GetterSection<any>[] = [this];
    for (let idx = 0; idx < descendantNodes.length; idx++) {
      const { childName, feId } = descendantNodes[idx];
      for (const section of sections) {
        if (section.hasChildName(childName)) {
          if (feId) {
            descendants.push(section.child({ childName, feId }));
          } else {
            descendants.push(...section.children(childName));
          }
        } else {
          throw section.isNotValidChildNameError(childName);
        }
      }
      if (!Arr.isLastIdx(descendantNodes, idx)) {
        sections = descendants;
        descendants = [];
      }
    }
    return descendants;
  }
  getOnlyDescendant(descendantNames: ChildName[]): GetterSection {
    const sections = this.getDescendants(descendantNames);
    this.list.exactlyOneOrThrow(sections, "descendantNames");
    return sections[0];
  }
  hasDescendantOfSn(info: DescendantOfSnInfo): boolean {
    return this.descendantsOfSn(info).length > 0;
  }
  descendantsOfSn<S extends SectionName>({
    sectionName,
    descendantNames,
  }: DescendantOfSnInfo<S>): GetterSection<S>[] {
    const sections = this.getDescendants(descendantNames);
    sections.forEach((section) => {
      if (!section.isOfSectionName(sectionName)) {
        throw section.notOfSectionNameError(sectionName);
      }
    });
    return sections as GetterSection<any>[];
  }
  descendantsOfSnByNode<S extends SectionName>({
    sectionName,
    descendantNodes,
  }: DescendantOfSnByNodeInfo<S>): GetterSection<S>[] {
    const sections = this.getDescendantsByNode(descendantNodes);
    sections.forEach((section) => {
      if (!section.isOfSectionName(sectionName)) {
        throw section.notOfSectionNameError(sectionName);
      }
    });
    return sections as GetterSection<any>[];
  }

  descendantOfSn<S extends SectionName>(
    descendantInfo: DescendantOfSnInfo<S>
  ): GetterSection<S> {
    const descendants = this.descendantsOfSn(descendantInfo);
    this.list.exactlyOneOrThrow(descendants, "descendantInfo");
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
  }: DescOfSnDbIdInfo<S>): GetterSection<S>[] {
    const sections = this.descendantsOfSn(rest);
    return sections.filter((section) => section.dbId === dbId);
  }
  descendantByPathAndDbId<S extends SectionName>(
    info: DescOfSnDbIdInfo<S>
  ): GetterSection<S> {
    const sections = this.descendantsByPathAndDbId(info);
    this.list.exactlyOneOrThrow(sections, "descendantDbIdInfo");
    return sections[0];
  }
  hasDescendantByPathAndDbId<S extends SectionName>(
    info: DescOfSnDbIdInfo<S>
  ): boolean {
    return this.descendantsByPathAndDbId(info).length > 0;
  }
  descendantFeIds(): DescendantIds {
    const descendantIds: DescendantIds = {};
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
  firstChild<CN extends ChildName<SN>, CT extends ChildSectionName<SN, CN>>(
    childName: CN
  ): GetterSection<CT> {
    const children = this.childrenOldToYoung(childName) as GetterSection<CT>[];
    return Arr.firstOrThrow(children);
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
        ...this.getterSectionsProps,
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
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
}

type GetterChildren<SN extends SectionName> = {
  [CN in ChildName<SN>]: GetterSection<ChildSectionName<SN, CN>>[];
};

type SectionValuesReq = {
  [varbName: string]: ValueName;
};
type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: StateValue<VNS[VN]>;
};
