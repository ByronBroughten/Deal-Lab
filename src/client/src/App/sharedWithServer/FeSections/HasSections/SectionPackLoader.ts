import { GConstructor } from "../../../utils/classObjects";
import {
  FeSectionPack,
  SectionPackSupplements,
} from "../../Analyzer/FeSectionPack";
import { AddSectionPropsNext } from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionArrPack, SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import { ChildName } from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { Obj } from "../../utils/Obj";
import { DescendantAdderI, DescendantAdderNext } from "./DescendantAdder";
import {
  ApplySelfAndChildRemover,
  SelfAndChildRemoverI,
} from "./SelfAndChildRemover";

type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};

export interface SectionPackLoaderI<SN extends SectionName>
  extends SectionPackLoaderMixins<SN> {
  loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void;
  loadChildSectionPackArr(childArrPack: SectionArrPack<ChildName<SN>>): void;
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options?: { feId?: string; idx?: number }
  ): void;
}

interface SectionPackLoaderMixins<SN extends SectionName>
  extends DescendantAdderI<SN>,
    SelfAndChildRemoverI<SN> {}

export function ApplySectionPackLoader<
  SN extends SectionName,
  TBase extends GConstructor<SectionPackLoaderMixins<SN>>
>(Base: TBase): GConstructor<SectionPackLoaderI<SN>> & TBase {
  return class SectionPackLoaderNext
    extends Base
    implements SectionPackLoaderI<SN>
  {
    loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void {
      for (const [sectionName, sectionPacks] of Obj.entries(childPackArrs)) {
        this.loadChildSectionPackArr({
          sectionName,
          sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
        });
      }
    }
    loadChildSectionPackArr<CN extends ChildName<SN>>(
      childArrPack: SectionArrPack<CN>
    ): void {
      this.wipeChildren(childArrPack.sectionName);
      const addSectionsProps = this.sectionArrPackToAddSectionProps(
        childArrPack.sectionPacks,
        this.feInfo as any as ParentFeInfo<CN>
      );
      this.addSections(addSectionsProps);
    }
    loadChildSectionPack<CN extends ChildName<SN>>(
      sectionPack: SectionPackRaw<CN>,
      options: { feId?: string; idx?: number } = {}
    ): void {
      this.loadSectionPack(sectionPack, {
        ...options,
        parentInfo: this.feInfo as any as ParentFeInfo<CN>,
      });
    }
    // protected loadSectionPackChildren<
    //   S extends SectionName,
    //   CN extends ChildName<S>
    // >(feInfo: FeInfo<S>, childArrPack: SectionArrPack<CN>) {
    //   this.wipeSectionChildren(feInfo, childArrPack.sectionName);
    //   const addSectionsProps = this.sectionArrPackToAddSectionProps(
    //     childArrPack.sectionPacks,
    //     feInfo as ParentFeInfo<CN>
    //   );
    //   this.addSections(addSectionsProps);
    // }
    private loadSectionPack<
      S extends SectionName,
      Props extends SectionPackSupplements<S>
    >(sectionPack: SectionPackRaw<S>, props: Props): void {
      const sectionNodes = FeSectionPack.makeOrderedPreSections(
        sectionPack,
        props
      );
      return this.addSections(sectionNodes as AddSectionPropsNext[]);
    }
    private sectionArrPackToAddSectionProps<SN extends SectionName>(
      sectionPackArr: SectionPackRaw<SN>[],
      parentInfo: ParentFeInfo<SN>
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
  };
}

const HasSelfAndChildRemover = ApplySelfAndChildRemover(DescendantAdderNext);
export const SectionPackLoader = ApplySectionPackLoader(HasSelfAndChildRemover);
