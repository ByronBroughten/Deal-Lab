import { applyMixins } from "../../../utils/classObjects";
import {
  FeSectionPack,
  SectionPackSupplements,
} from "../../Analyzer/FeSectionPack";
import {
  AddSectionProps,
  AddSectionPropsNext,
} from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionArrPack, SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import { LoginUser } from "../../apiQueriesShared/login";
import { FeInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import { DescendantAdder } from "./DescendantAdder";
import { HasFullSectionProps } from "./FullSection";
import { SectionRemover } from "./SectionRemover";

// integrate this with FullSection
// But what is the point of FullSection if it can't solve?
// It will serve as the base of SolverSection
// SolverSection will share a core with FullSection
// Yes, this makes sense.
// Everything that can be done at the fullSection level will
// And then SolverSection will have a couple fns

export interface SectionPackLoader<SN extends SectionName>
  extends DescendantAdder<SN>,
    SectionRemover<SN> {}
export class SectionPackLoader<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  loadLoginUser(loginUser: LoginUser) {
    for (const [sectionName, sectionPacks] of Obj.entries(loginUser)) {
      this.loadSectionPackChildren(this.sections.mainFeInfo, {
        sectionName,
        sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
      });
    }
  }
  loadSectionPackChildren<
    SN extends SectionName<"hasChild">,
    CN extends ChildName<SN>
  >(feInfo: FeInfo<SN>, childArrPack: SectionArrPack<CN>) {
    this.wipeSectionChildren(feInfo, childArrPack.sectionName);
    const addSectionsProps = this.sectionArrPackToAddSectionProps(
      childArrPack.sectionPacks,
      feInfo as FeParentInfo<CN>
    );
    this.addSections(addSectionsProps);
  }
  loadSectionPack<
    SN extends SectionName,
    Props extends SectionPackSupplements<SN>
  >(sectionPack: SectionPackRaw<SN>, props: Props): void {
    const sectionNodes = FeSectionPack.makeOrderedPreSections(
      sectionPack,
      props
    );
    return this.addSections(sectionNodes as AddSectionProps[]);
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
      addSectionsProps.push(...(sectionNodes as AddSectionProps[]));
    }
    return addSectionsProps;
  }
}

applyMixins(SectionPackLoader, [SectionAdder, SectionRemover]);
