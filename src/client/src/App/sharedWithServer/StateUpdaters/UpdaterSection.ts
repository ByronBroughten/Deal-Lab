import { DbVarbs } from "../SectionPack/RawSection";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { VarbValues } from "../SectionsMeta/baseSectionTypes";
import { FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildArrInfo,
  ChildIdArrsNarrow,
  ChildName,
  ChildType,
  CreateChildInfo,
  DescendantType,
  FeChildInfo,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { InitRawFeSectionProps } from "../StateSections/initRawSection";
import { StateSections } from "../StateSections/StateSections";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { StrictOmit } from "../utils/types";
import { GetterSections } from "./../StateGetters/GetterSections";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterList } from "./UpdaterList";
import { UpdaterVarb } from "./UpdaterVarb";

type UpdateableRawFeSection<SN extends SectionName> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionName
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
    for (const childName of this.get.childNames) {
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
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): UpdaterSection<ChildType<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.updaterSection(feInfo);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { idx, ...rest }: AddChildOptions<SN> = {}
  ): void {
    const sectionName = this.get.meta.childType(childName);
    const section = StateSections.initRawSection({
      sectionName,
      ...rest,
    });
    const childList = this.updaterList.updaterList(sectionName);
    if (idx === undefined) {
      childList.push(section);
    } else {
      childList.insert({ section, idx });
    }

    const { feId } = childList.get.last;
    this.addChildFeId({ childName, feId });
  }
  updateValuesDirectly(values: VarbValues): void {
    for (const varbName of Obj.keys(values)) {
      const varb = this.varb(varbName as string);
      varb.updateValueDirectly(values[varbName]);
    }
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
  private updaterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): UpdaterSection<S> {
    return new UpdaterSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  updateVarbsFromDb(dbVarbs: DbVarbs): void {
    this.updateProps({
      varbs: StateSections.initRawVarbs({
        dbVarbs,
        ...this.feSectionInfo,
      }),
    });
  }
  updateProps(nextBaseProps: Partial<UpdateableRawFeSection<SN>>): void {
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
  static initMainProps(): GetterSectionProps<"main"> {
    const root = this.initRootUpdater();
    root.addChild("main");
    const main = root.get.youngestChild("main");
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
  static initOmniParentProps(): GetterSectionProps<"omniParent"> {
    const root = this.initRootUpdater();
    root.addChild("omniParent");
    const omniParent = root.get.youngestChild("omniParent");
    return omniParent.getterSectionProps;
  }
  static initRootUpdater(): UpdaterSection<"root"> {
    return new UpdaterSection(this.initRootProps());
  }
}

interface AddSectionPropsNext<SN extends SimpleSectionName = SimpleSectionName>
  extends InitRawFeSectionProps<SN> {
  sectionName: SN;
  childFeIds?: ChildIdArrsNarrow<SN>;
  idx?: number;
}

export type DescendantList<
  SN extends SectionName,
  DN extends DescendantType<SN> = DescendantType<SN>
> = readonly [...DescendantType<SN>[], DN];

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, OmitProps>;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantType<SN> = DescendantType<SN>
> = StrictOmit<AddSectionPropsNext<DN>, OmitProps>;

type OmitProps = "sectionName" | "childFeIds";
