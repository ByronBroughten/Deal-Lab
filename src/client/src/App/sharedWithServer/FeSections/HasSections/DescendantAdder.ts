import { applyMixins } from "../../../utils/classObjects";
import { AddSectionPropsNext } from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { FeSectionInfo, InfoS } from "../../SectionMetas/Info";
import {
  ChildName,
  DescendantName,
  NewSectionInfo,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../../SectionMetas/SectionName";
import { StrictOmit } from "../../utils/types";
import FeSection from "../FeSection";
import {
  HasFullSectionProps,
  SectionGetter,
  SectionsUpdater,
} from "./FullSection";

export type DescendantList<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = readonly [...DescendantName<SN>[], DN];

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, "sectionName" | "parentInfo">;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = StrictOmit<AddSectionPropsNext<DN>, "parentInfo" | "sectionName">;

export class DescendantAdder<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    props: AddDescendantOptions<SN, DN> = {}
  ) {
    let { sectionName, feId } = this.info as FeSectionInfo<
      SelfOrDescendantName<SN>
    >;

    for (let i = 0; i++; i < descendantPath.length) {
      const childName = descendantPath[i];
      if (this.isValidChildNameOrThrow(sectionName as SectionName, childName)) {
        const commonProps = {
          parentInfo: InfoS.fe(sectionName as SectionName, feId) as any,
          sectionName: childName,
        };
        if (i === descendantPath.length - 1) {
          this.addOneSection({
            ...props,
            ...commonProps,
          });
        } else if (this.sectionList(childName).isEmpty) {
          this.addOneSection(commonProps);
        }
      }
      ({ sectionName, feId } = {
        sectionName: childName as any,
        feId: this.sectionList(childName).last.feId,
      });
    }
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    props: AddChildOptions<SN>
  ) {
    this.addOneSection({
      sectionName: childName,
      ...props,
      parentInfo: this.feInfo as any,
    } as AddSectionPropsNext<DescendantName<SN>>);
  }
  protected addOneSection<S extends SectionName>(
    props: AddSectionPropsNext<S>
  ) {
    this.pushSectionToList(props);
    if (sectionNameS.is(props.sectionName, "hasParent")) {
      this.addChildFeIdToParent(
        props as AddSectionPropsNext<SectionName<"hasParent">>
      );
    }
  }
  protected addSections(parentFirstPropsArr: AddSectionPropsNext[]) {
    for (const props of parentFirstPropsArr as AddSectionPropsNext[]) {
      this.addOneSection(props);
    }
  }
  private isValidChildNameOrThrow<SN extends SectionName>(
    sectionName: SN,
    childName: SectionName
  ): childName is ChildName<SN> {
    const meta = this.sectionMeta(sectionName);
    if (!meta.isChildName(childName)) {
      throw new Error(`${childName} is not a child of ${sectionName}`);
    } else return true;
  }
  private pushSectionToList(props: AddSectionPropsNext) {
    const { sectionName } = props;
    this.sections = this.sections.updateList(
      this.sections.list(sectionName).push(
        FeSection.initNext({
          ...props,
        })
      )
    );
  }
  private addChildFeIdToParent(
    props: StrictOmit<NewSectionInfo<"hasParent">, "feId">
  ) {
    const { parentInfo, feId } = this.sections.list(props.sectionName).last;
    const parent = this.sections
      .one(parentInfo)
      .addChildFeId({ ...props, feId });
    this.sections = this.sections.updateSection(parent as any);
  }
}

export interface DescendantAdder<SN extends SectionName>
  extends SectionGetter<SN>,
    SectionsUpdater<SN> {}
applyMixins(DescendantAdder, [SectionGetter, SectionsUpdater]);

// export class SectionAdder extends HasSharableSections {

//   addSection({ idx, ...props }: AddSectionProps) {
//     this.pushSectionToList(props);
//     const { feInfo } = this.sections.list(props.sectionName).last;
//     if (InfoS.is.fe(feInfo, "hasParent")) {
//       this.addToParentChildIds(feInfo, idx);
//     }
//   }
//   private pushSectionToList(props: AddSectionProps) {
//     const { sectionName, parentFinder } = props;
//     this.sections = this.sections.updateList(
//       this.sections.list(sectionName).push(
//         FeSection.initNext({
//           parentInfo: this.sections.parentFinderToInfo(parentFinder as any),
//           ...props,
//         })
//       )
//     );
//   }
//   private addToParentChildIds(feInfo: FeInfo<"hasParent">, idx?: number) {
//     const { sectionName, id: feId } = feInfo;
//     const parentSection = this.sections.parent(feInfo);
//     const nextParent = parentSection.addChildFeId({ sectionName, feId, idx });
//     this.sections = this.sections.updateSection(nextParent);
//   }
//   static initCore() {}
// }
