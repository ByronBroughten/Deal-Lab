import { Id } from "../../Ids/IdS";
import { FeSectionInfo } from "../../SectionInfo/FeInfo";
import { SectionNameByType } from "../../SectionNameByType";
import { StateSections } from "../../State/StateSections";
import {
  ContextPathIdxSpecifier,
  RawFeSection,
} from "../../State/StateSectionsTypes";
import { InitRawFeSectionProps } from "../../State/initRawSection";
import { GetterSectionProps } from "../../StateGetters/Bases/GetterSectionBase";
import { NotAVarbNameError } from "../../StateGetters/Bases/GetterVarbBase";
import { GetterSections } from "../../StateGetters/GetterSections";
import { SectionPathContextName } from "../../sectionPaths/sectionPathContexts";
import { SectionName } from "../../sectionVarbsConfig/SectionName";
import { SectionValues, StateValue } from "../../sectionVarbsConfig/StateValue";
import { VarbName } from "../../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildArrInfo,
  ChildIdArrsNarrow,
  ChildName,
  CreateChildInfo,
  FeChildInfo,
} from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";
import { ParentNameSafe } from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ParentName";
import { Arr } from "../../utils/Arr";
import { ValidationError } from "../../utils/Error";
import { Obj } from "../../utils/Obj";
import { StrictOmit } from "../../utils/types";
import { UpdaterList } from "./UpdaterList";
import { UpdaterSectionBase } from "./UpdaterSectionBase";
import { UpdaterVarb } from "./UpdaterVarb";

type UpdateableRawFeSection<SN extends SectionNameByType> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  get parent(): UpdaterSection<ParentNameSafe<SN>> {
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
  loadRawSection({
    dbId,
    sectionValues,
  }: {
    dbId: string;
    sectionValues: Partial<SectionValues<SN>>;
  }) {
    this.updateDbId(dbId);
    // RawSections (from sectionPacks) are assumed as potentially stale and imperfect
    this.updateSusValues(sectionValues);
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
  children<CN extends ChildName<SN>>(
    childName: CN
  ): UpdaterSection<ChildSectionName<SN, CN>>[] {
    const feIds = this.get.childFeIds(childName);
    return feIds.map((feId) =>
      this.child({
        feId,
        childName,
      })
    );
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
  isOfSectionName<S extends SectionName>(
    sectionName: S
  ): this is UpdaterSection<S> {
    return this.get.isOfSectionName(sectionName);
  }
  finishNewSection() {
    const section = this;
    if (section.isOfSectionName("property")) {
      const { parent } = section.get;
      if (parent.isOfSectionName("deal")) {
        const dealMode = parent.valueNext("dealMode");
        section.updateValues({ propertyMode: dealMode });
      }
    }
    if (section.isOfSectionName("loan")) {
      const { parent } = section.get;
      if (parent.isOfSectionName("financing")) {
        const financingMode = parent.valueNext("financingMode");
        section.updateValues({ financingMode });
        const base = section.onlyChild("loanBaseValue");
        base.updateValues({ financingMode });
      }
    }
  }
  private getChildProps<CN extends ChildName<SN>>({
    childName,
    sectionContextName = this.pickSectionContextName(childName),
    contextPathIdxSpecifier = {},
    feId = Id.make(),
  }: {
    childName: CN;
    feId?: string;
    sectionContextName?: SectionPathContextName;
    contextPathIdxSpecifier?: ContextPathIdxSpecifier;
  }): {
    feId: string;
    sectionName: ChildSectionName<SN, CN>;
    sectionContextName: SectionPathContextName;
    contextPathIdxSpecifier: ContextPathIdxSpecifier;
  } {
    const { sectionMeta } = this;
    const sectionName = sectionMeta.childType(childName);
    const traitSpecifier = this.traitContextPathIdxSpecifier({
      childName,
      feId,
      sectionContextName,
    });
    return {
      feId,
      sectionName,
      sectionContextName,
      contextPathIdxSpecifier: {
        ...this.get.contextPathIdxSpecifier,
        ...traitSpecifier,
        ...contextPathIdxSpecifier,
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
      const idxOrUn = specifier[sectionContextName];
      if (idxOrUn !== undefined) {
        return {
          [idxOrUn]: {
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
      const varb = this.varbNext(varbName);
      varb.updateValue(values[varbName] as StateValue);
    }
  }
  updateSusValues(values: Partial<SectionValues<SN>>): void {
    for (const varbName of Obj.keys(values)) {
      try {
        const varb = this.varbNext(varbName);
        varb.updateValue(values[varbName] as StateValue);
      } catch (err) {
        if (err instanceof NotAVarbNameError) {
          continue;
        } else if (err instanceof ValidationError) {
          const varb = this.varbNext(varbName);
          varb.updateValue(varb.meta.initValue);
        } else {
          throw err;
        }
      }
    }
  }
  resetVarbs(sectionValues: Partial<SectionValues<SN>> = {}): void {
    this.updateProps({
      varbs: StateSections.initRawVarbs({
        sectionValues,
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
    main.addChild("feStore");
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
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CSN extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends StrictOmit<AddSectionProps<CSN>, OmitProps> {}

type OmitProps = "sectionName" | "childFeIds";
