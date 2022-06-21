import { DbVarbs } from "../SectionPack/RawSection";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { VarbValues } from "../SectionsMeta/baseSectionTypes";
import { FeChildInfo, FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildIdArrsNarrow,
  ChildName,
  DescendantName,
  NewChildInfo
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps
} from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { InitRawFeSectionProps } from "../StateSections/initRawSection";
import { StateSections } from "../StateSections/StateSections";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { StrictOmit } from "../utils/types";
import { GetterSections } from "./../StateGetters/GetterSections";
import { UpdaterList } from "./UpdaterList";
import { UpdaterVarb } from "./UpdaterVarb";

type UpdateableRawFeSection<SN extends SectionName> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  private updaterList = new UpdaterList(this.getterSectionProps);
  get = new GetterSection(this.getterSectionProps);
  private getterSections = new GetterSections(this.getterSectionsProps);

  private get parent(): UpdaterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.updaterSection(parentInfoSafe);
  }
  varb(varbName: string): UpdaterVarb<SN> {
    return new UpdaterVarb({
      ...this.getterSectionProps,
      varbName,
    });
  }
  removeSelf(): void {
    this.removeAllChildren();
    this.parent.removeChildFeId(this.feSectionInfo as any);
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
      this.removeChild({ sectionName: childName, feId });
    }
  }
  removeChild(info: FeChildInfo<SN>): void {
    const childRemover = this.updaterSection(info);
    childRemover.removeSelf();
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { idx, ...rest }: AddChildOptions<SN> = {}
  ): void {
    const section = StateSections.initRawSection({
      sectionName: childName,
      ...rest,
    });

    const childList = this.updaterList.updaterList(childName);
    if (typeof idx === "undefined") {
      childList.push(section);
    } else {
      childList.insert({ section, idx });
    }

    const { feSectionInfo } = childList.get.last;
    this.addChildFeId(feSectionInfo);
  }
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    options: AddDescendantOptions<SN, DN> = {}
  ): void {
    let feInfo = this.get.feSectionInfo as FeSectionInfo;
    for (let i = 0; i < descendantPath.length; i++) {
      const getter = this.get.getterSection(feInfo);
      const childName = descendantPath[i];
      if (getter.isChildNameOrThrow(childName)) {
        const updater = this.updaterSection(feInfo);
        const o = i === descendantPath.length - 1 ? options : {};
        updater.addChild(childName, o);
      }
      feInfo = {
        sectionName: childName,
        feId: this.getterSections.newestEntry(childName).feId,
      };
    }
  }
  updateValuesDirectly(values: VarbValues): void {
    for (const varbName of Obj.keys(values)) {
      const varb = this.varb(varbName as string);
      varb.updateValueDirectly(values[varbName]);
    }
  }
  private addChildFeId(childInfo: NewChildInfo<SN>): void {
    const { sectionName, feId, idx } = childInfo;
    const feIds = this.get.childFeIds(sectionName);
    let nextIds: string[];
    if (typeof idx === "undefined") nextIds = [...feIds, feId];
    else nextIds = Arr.insert(feIds, feId, idx);
    this.updateChildFeIds({ sectionName, feIds: nextIds });
  }
  private removeChildFeId(childInfo: FeSectionInfo<ChildName<SN>>): void {
    const { sectionName, feId } = childInfo;
    const feIds = this.get.childFeIds(sectionName);
    const nextIds = Arr.rmFirstMatchCloneOrThrow(feIds, feId);
    this.updateChildFeIds({ sectionName, feIds: nextIds });
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
  updateChildFeIds({
    sectionName,
    feIds,
  }: {
    sectionName: ChildName<SN>;
    feIds: string[];
  }): void {
    this.updateProps({
      childFeIds: {
        ...(this.get.allChildFeIds as any),
        [sectionName]: feIds,
      },
    });
  }
  static initMainProps(): GetterSectionProps<"main"> {
    const root = this.initRootUpdater();
    root.addChild("main");
    const main = root.get.youngestChild("main");
    return main.getterSectionProps;
  }
  static initOmniParentProps(): GetterSectionProps<"omniParent"> {
    const root = this.initRootUpdater();
    root.addChild("omniParent");
    const omniParent = root.get.youngestChild("omniParent");
    return omniParent.getterSectionProps;
  }
  static initRootUpdater(): UpdaterSection<"root"> {
    const sections = StateSections.initWithRoot();
    const rootRaw = sections.onlyOneRawSection("root");
    return new UpdaterSection({
      ...rootRaw,
      sectionsShare: { sections },
    });
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
  DN extends DescendantName<SN> = DescendantName<SN>
> = readonly [...DescendantName<SN>[], DN];

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, OmitProps>;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = StrictOmit<AddSectionPropsNext<DN>, OmitProps>;

type OmitProps = "sectionName" | "childFeIds";
