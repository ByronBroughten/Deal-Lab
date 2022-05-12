import { applyMixins } from "../../../utils/classObjects";
import {
  FeSectionPack,
  SectionPackSupplements
} from "../../Analyzer/FeSectionPack";
import { AddSectionPropsNext } from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionArrPack, SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import { FeInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import { DescendantAdder } from "./DescendantAdder";
import { SelfAndChildRemover } from "./SelfAndChildRemover";

type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};

export class SectionPackLoader<
  SN extends SectionName
> extends DescendantAdder<SN> {
  // This should work for loading LoginUser
  loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>) {
    for (const [sectionName, sectionPacks] of Obj.entries(childPackArrs)) {
      this.loadChildSectionPackArr({
        sectionName,
        sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
      });
    }
  }
  loadChildSectionPackArr(childArrPack: SectionArrPack<ChildName<SN>>) {
    this.loadSectionPackChildren(this.feInfo, childArrPack);
  }
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options: { feId?: string; idx?: number } = {}
  ) {
    this.loadSectionPack(sectionPack, {
      ...options,
      parentInfo: this.feInfo as any as FeParentInfo<CN>,
    });
  }
  protected loadSectionPackChildren<
    S extends SectionName,
    CN extends ChildName<S>
  >(feInfo: FeInfo<S>, childArrPack: SectionArrPack<CN>) {
    this.wipeSectionChildren(feInfo, childArrPack.sectionName);
    const addSectionsProps = this.sectionArrPackToAddSectionProps(
      childArrPack.sectionPacks,
      feInfo as FeParentInfo<CN>
    );
    this.addSections(addSectionsProps);
  }
  protected loadSectionPack<
    S extends SectionName,
    Props extends SectionPackSupplements<S>
  >(sectionPack: SectionPackRaw<S>, props: Props): void {
    const sectionNodes = FeSectionPack.makeOrderedPreSections(
      sectionPack,
      props
    );
    return this.addSections(sectionNodes as AddSectionPropsNext[]);
  }
  protected sectionArrPackToAddSectionProps<SN extends SectionName>(
    sectionPackArr: SectionPackRaw<SN>[],
    parentInfo: FeParentInfo<SN>
  ) {
    const addSectionsProps: AddSectionPropsNext[] = [];
    for (const sectionPack of sectionPackArr) {
      const sectionNodes = FeSectionPack.makeOrderedPreSections(sectionPack, {
        parentInfo,
      });
      addSectionsProps.push(...(sectionNodes as AddSectionPropsNext[]));
    }
    return addSectionsProps;
  }
}

export interface SectionPackLoader<SN extends SectionName>
  extends SelfAndChildRemover<SN> {}

applyMixins(SectionPackLoader, [SelfAndChildRemover]);
