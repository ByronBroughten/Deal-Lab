import { GConstructor } from "../../utils/classObjects";
import {
  FeSectionPackNext,
  SectionPackContext,
} from "../Analyzer/FeSectionPackNext";
import { AddSectionPropsNext } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionArrPack, SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { FeParentInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { DescendantAdder, DescendantAdderI } from "./DescendantAdder";
import { FocalSectionBase } from "./FocalSectionBase";
import {
  SelfAndChildRemover,
  SelfAndChildRemoverI,
} from "./SelfAndChildRemover";

type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};

export interface SectionPackLoaderI<SN extends SectionName>
  extends FocalSectionBase<SN> {
  loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void;
  loadChildSectionPackArr<CN extends ChildName<SN>>(
    childArrPack: SectionArrPack<CN>
  ): void;
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options?: { feId?: string; idx?: number }
  ): void;
}

export function ApplySectionPackLoader<
  SN extends SectionName,
  TBase extends GConstructor<FocalSectionBase<SN>>
>(Base: TBase): GConstructor<SectionPackLoaderI<SN>> & TBase {
  return class SectionPackLoaderNext
    extends Base
    implements SectionPackLoaderI<SN>
  {
    private adder = new DescendantAdder(
      this.self.constructorProps
    ) as DescendantAdderI<SN>;
    private remover = new SelfAndChildRemover(
      this.self.constructorProps
    ) as SelfAndChildRemoverI<SN>;
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
      this.remover.wipeChildren(childArrPack.sectionName);
      const addSectionsProps = this.sectionArrPackToAddSectionProps(
        childArrPack.sectionPacks,
        this.self.feInfo as any as FeParentInfo<CN>
      );
      this.adder.addSections(addSectionsProps);
    }
    loadChildSectionPack<CN extends ChildName<SN>>(
      sectionPack: SectionPackRaw<CN>,
      options: { feId?: string; idx?: number } = {}
    ): void {
      this.loadSectionPack(sectionPack, {
        ...options,
        parentInfo: this.self.feInfo as any as FeParentInfo<CN>,
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
    private loadSectionPack<S extends SectionName>(
      sectionPack: SectionPackRaw<S>,
      sectionPackContext: SectionPackContext<S>
    ): void {
      const sectionNodes = FeSectionPackNext.makeOrderedPreSections({
        sectionPack,
        sectionPackContext,
      });
      return this.adder.addSections(sectionNodes as AddSectionPropsNext[]);
    }
    private sectionArrPackToAddSectionProps<SN extends SectionName>(
      sectionPackArr: SectionPackRaw<SN>[],
      parentInfo: FeParentInfo<SN>
    ) {
      const addSectionsProps: AddSectionPropsNext[] = [];
      for (const sectionPack of sectionPackArr) {
        const sectionNodes = FeSectionPackNext.makeOrderedPreSections({
          sectionPack,
          sectionPackContext: { parentInfo },
        });
        addSectionsProps.push(...(sectionNodes as AddSectionPropsNext[]));
      }
      return addSectionsProps;
    }
  };
}

export const SectionPackLoader = ApplySectionPackLoader(FocalSectionBase);
