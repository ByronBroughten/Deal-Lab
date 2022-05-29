import { AddSectionPropsNext } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { DbVarbs } from "../Analyzer/SectionPackRaw/RawSection";
import { FeChildInfo, FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
  NewChildInfo,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import {
  RawFeSection,
  StateSections,
} from "../StateSections/StateSectionsNext";
import { Arr } from "../utils/Arr";
import { StrictOmit } from "../utils/types";
import { FeParentInfo } from "./../SectionsMeta/Info";
import { GetterSections } from "./../StateGetters/GetterSections";
import { UpdaterList } from "./UpdaterList";

type UpdateableRawFeSection<SN extends SectionName> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  private updaterList = new UpdaterList(this.getterSectionProps);
  private getterSection = new GetterSection(this.getterSectionProps);
  private getterSections = new GetterSections(this.sectionsShare);

  private get parent(): UpdaterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.getterSection;
    return this.updaterSection(parentInfoSafe);
  }
  removeSelf(): void {
    this.removeAllChildren();
    this.parent.removeChildFeId(this.feSectionInfo as any);
    this.updaterList.removeByFeId(this.feId);
  }
  removeAllChildren() {
    for (const childName of this.getterSection.childNames) {
      this.removeChildren(childName);
    }
  }
  removeChildren(childName: ChildName<SN>): void {
    const childIds = this.getterSection.childFeIds(childName);
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
      parentInfo: this.feSectionInfo as any as FeParentInfo<typeof childName>,
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
    let feInfo = this.getterSection.feSectionInfo as FeSectionInfo;
    for (let i = 0; i < descendantPath.length; i++) {
      const getter = this.getterSection.getterSection(feInfo);
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
  private addChildFeId(childInfo: NewChildInfo<SN>): void {
    const { sectionName, feId, idx } = childInfo;
    const feIds = this.getterSection.childFeIds(sectionName);
    let nextIds: string[];
    if (typeof idx === "undefined") nextIds = [...feIds, feId];
    else nextIds = Arr.insert(feIds, feId, idx);
    this.updateChildFeIds({ sectionName, feIds: nextIds });
  }
  private removeChildFeId(childInfo: FeSectionInfo<ChildName<SN>>): void {
    const { sectionName, feId } = childInfo;
    const feIds = this.getterSection.childFeIds(sectionName);
    const nextIds = Arr.rmFirstValueClone(feIds, feId);
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
  updateProps(nextBaseProps: Partial<UpdateableRawFeSection<SN>>) {
    this.updaterList.replace({
      ...this.getterSection.raw,
      ...nextBaseProps,
    });
  }
  private updateChildFeIds({
    sectionName,
    feIds,
  }: {
    sectionName: ChildName<SN>;
    feIds: string[];
  }) {
    this.updateProps({
      childFeIds: {
        ...(this.getterSection.allChildFeIds as any),
        [sectionName]: feIds,
      },
    });
  }
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

type OmitProps = "sectionName" | "parentInfo" | "childFeIds";
