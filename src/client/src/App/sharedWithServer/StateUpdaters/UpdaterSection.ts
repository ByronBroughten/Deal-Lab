import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { Id } from "../SectionsMeta/id";
import {
  ChildArrInfo,
  ChildIdArrsNarrow,
  ChildName,
  CreateChildInfo,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ParentNameSafe } from "../SectionsMeta/sectionChildrenDerived/ParentName";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { SectionPathContextName } from "../SectionsMeta/sectionPathContexts";
import {
  SectionValues,
  SomeSectionValues,
  StateValue,
} from "../SectionsMeta/values/StateValue";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { InitRawFeSectionProps } from "../StateSections/initRawSection";
import { StateSections } from "../StateSections/StateSections";
import {
  ContextPathIdxSpecifier,
  RawFeSection,
} from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { StrictOmit } from "../utils/types";
import { GetterSections } from "./../StateGetters/GetterSections";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterList } from "./UpdaterList";
import { UpdaterVarb } from "./UpdaterVarb";

type UpdateableRawFeSection<SN extends SectionNameByType> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  private get parent(): UpdaterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.updaterSection(parentInfoSafe);
  }
  get updaterList(): UpdaterList<SN> {
    return new UpdaterList(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionsProps);
  }
  varb(varbName: string): UpdaterVarb<SN> {
    return new UpdaterVarb({
      ...this.getterSectionProps,
      varbName,
    });
  }
  varbNext(varbName: VarbName<SN>): UpdaterVarb<SN> {
    return this.varb(varbName as string);
  }
  resetSolvableTexts() {
    for (const varb of this.varbArr) {
      if (varb.meta.valueName === "numObj") {
        varb.updateValue({
          ...varb.get.value("numObj"),
          solvableText: "",
        });
      }
    }
  }
  get varbArr() {
    return this.sectionMeta.varbNamesNext.map((varbName) => {
      return this.varbNext(varbName);
    });
  }
  removeSelf(): void {
    this.removeAllChildren();
    const { parent } = this;
    const childName = parent.get.sectionChildName(this.feInfo);
    parent.removeChildFeId({
      childName,
      feId: this.feId,
    });
    this.updaterList.removeByFeId(this.feId);
  }
  removeAllChildren() {
    this.removeAllChildrenInArrs(this.get.childNames);
  }
  removeAllChildrenInArrs<CN extends ChildName<SN>>(childNames: CN[]): void {
    for (const childName of childNames) {
      this.removeChildren(childName);
    }
  }
  removeChildren(childName: ChildName<SN>): void {
    const childIds = this.get.childFeIds(childName);
    for (const feId of childIds) {
      this.removeChild({ childName, feId });
    }
  }
  removeChild(childInfo: FeChildInfo<SN>): void {
    this.child(childInfo).removeSelf();
  }
  onlyChild<CN extends ChildName<SN>>(childName: CN) {
    const { feInfo } = this.get.onlyChild(childName);
    return this.updaterSection(feInfo);
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): UpdaterSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.updaterSection(feInfo);
  }

  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { idx, ...rest }: AddChildOptions<SN, CN> = {}
  ): void {
    const { sectionName, ...props } = this.getChildProps({
      ...rest,
      childName,
    });
    const section = StateSections.initRawSection({
      sectionName,
      ...rest,
      ...props,
    } as InitRawFeSectionProps<any>);

    const childList = this.updaterList.updaterList(sectionName);
    childList.push(section);
    this.addChildFeId({ childName, feId: props.feId, idx });
  }
  private getChildProps<CN extends ChildName<SN>>({
    childName,
    contextIdxSpecifier = {},
    feId = Id.make(),
  }: {
    childName: CN;
    feId?: string;
    contextIdxSpecifier?: ContextPathIdxSpecifier;
  }): {
    feId: string;
    sectionName: ChildSectionName<SN, CN>;
    sectionContextName: SectionPathContextName;
    contextPathIdxSpecifier: ContextPathIdxSpecifier;
  } {
    const { sectionMeta } = this;
    const sectionName = sectionMeta.childType(childName);
    const sectionContextName = this.pickSectionContextName(childName);
    const traitSpecifier = this.traitContextPathIdxSpecifier({
      childName,
      feId,
      sectionContextName,
    });
    return {
      feId,
      sectionName,
      sectionContextName: sectionContextName,
      contextPathIdxSpecifier: {
        ...this.get.contextPathIdxSpecifier,
        ...traitSpecifier,
        ...contextIdxSpecifier,
      },
    };
  }
  private traitContextPathIdxSpecifier({
    childName,
    sectionContextName,
    feId,
  }: {
    childName: ChildName<SN>;
    sectionContextName: SectionPathContextName;
    feId: string;
  }): ContextPathIdxSpecifier {
    const { sectionMeta } = this;
    const { sectionContextSpecifier: specifier } =
      sectionMeta.childTraits(childName);

    if (specifier) {
      if (specifier.contextNameTrigger === sectionContextName) {
        return {
          [specifier.idx]: {
            selfChildName: childName as ChildName,
            feId,
          },
        };
      }
    }
    return {};
  }
  private pickSectionContextName(
    childName: ChildName<SN>
  ): SectionPathContextName {
    const { sectionContextName } = this.sectionMeta.childTraits(childName);
    return sectionContextName ?? this.get.sectionContextName;
  }

  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): UpdaterSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    const { feInfo } = this.get.youngestChild(childName);
    return this.updaterSection(feInfo);
  }
  updateValues(values: Partial<SectionValues<SN>>): void {
    for (const varbName of Obj.keys(values)) {
      const varb = this.varb(varbName as string);
      varb.updateValue(values[varbName] as StateValue);
    }
  }
  resetVarbs(dbVarbs: SomeSectionValues<SN>): void {
    this.updateProps({
      varbs: StateSections.initRawVarbs({
        dbVarbs,
        ...this.feSectionInfo,
      }),
    });
  }
  private addChildFeId(childInfo: CreateChildInfo<SN>): void {
    const { childName, feId, idx } = childInfo;
    const feIds = this.get.childFeIds(childName);
    let nextIds: string[];
    if (typeof idx === "undefined") nextIds = [...feIds, feId];
    else nextIds = Arr.insert(feIds, feId, idx);
    this.updateChildFeIds({ childName, feIds: nextIds });
  }
  private removeChildFeId(childInfo: FeChildInfo<SN>): void {
    const { childName, feId } = childInfo;
    const feIds = this.get.childFeIds(childName);
    const nextIds = Arr.rmFirstMatchCloneOrThrow(feIds, feId);
    this.updateChildFeIds({ childName, feIds: nextIds });
  }
  newDbId(): void {
    this.updateDbId(Id.make());
  }
  updateDbId(dbId: string): void {
    this.updateProps({ dbId });
  }
  private updateProps(
    nextBaseProps: Partial<UpdateableRawFeSection<SN>>
  ): void {
    this.updaterList.replace({
      ...this.get.raw,
      ...nextBaseProps,
    });
  }
  updateChildFeIds({ childName, feIds }: ChildArrInfo<SN>): void {
    this.updateProps({
      childFeIds: {
        ...(this.get.allChildFeIds as any),
        [childName]: feIds,
      },
    });
  }
  updaterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): UpdaterSection<S> {
    return new UpdaterSection({
      ...feInfo,
      ...this.getterSectionsProps,
    });
  }
  static initOmniParentProps(): GetterSectionProps<"omniParent"> {
    const root = this.initRootUpdater();
    root.addChild("omniParent");
    const omniParent = root.get.youngestChild("omniParent");
    return omniParent.getterSectionProps;
  }
  static initRootUpdater(): UpdaterSection<"root"> {
    return new UpdaterSection(this.initRootProps());
  }
  static initMainSectionProps(): GetterSectionProps<"main"> {
    const root = this.initRootUpdater();
    root.addChild("main");
    const main = root.get.youngestChild("main");
    return main.getterSectionProps;
  }
  static initMainSectionPropsWithEmptyUser(): GetterSectionProps<"main"> {
    const root = this.initRootUpdater();
    root.addChild("main");
    const main = root.onlyChild("main");
    main.addChild("feUser");
    return main.getterSectionProps;
  }
  static initRootProps(): GetterSectionProps<"root"> {
    const sections = StateSections.initWithRoot();
    const rootRaw = sections.onlyOneRawSection("root");
    return {
      ...rootRaw,
      sectionsShare: { sections },
    };
  }
}

interface AddSectionProps<SN extends SectionName = SectionName>
  extends InitRawFeSectionProps<SN> {
  sectionName: SN;
  childFeIds?: ChildIdArrsNarrow<SN>;
  idx?: number;
}

export interface AddChildOptions<
  SN extends SectionNameByType,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends StrictOmit<AddSectionProps<CT>, OmitProps> {}

type OmitProps = "sectionName" | "childFeIds";
