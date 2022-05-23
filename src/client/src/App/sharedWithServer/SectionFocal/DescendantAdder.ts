import { GConstructor } from "../../utils/classObjects";
import { AddSectionPropsNext } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { UpdaterSections } from "../Sections/UpdaterSections";
import {
  FeParentInfo,
  FeSectionInfo,
  FeSelfOrDescendantInfo,
} from "../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
  NewSectionInfo,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { FeSection } from "../SectionsState/FeSection";
import { StrictOmit } from "../utils/types";
import { FocalSectionBase } from "./FocalSectionBase";

export interface DescendantAdderI<SN extends SectionName>
  extends FocalSectionBase<SN> {
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    options?: AddDescendantOptions<SN, DN>
  ): void;
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN>
  ): void;
  addOneSection<S extends SectionName>(props: AddSectionPropsNext<S>): void;
  addSections(parentFirstPropsArr: AddSectionPropsNext[]): void;
}

export function ApplyDescendantAdderNext<
  SN extends SectionName,
  TBase extends GConstructor<FocalSectionBase<SN>>
>(Base: TBase): GConstructor<DescendantAdderI<SN>> & TBase {
  return class DescendantAdder extends Base {
    private sections = new UpdaterSections(this.shared);
    addDescendant<DN extends DescendantName<SN>>(
      descendantPath: DescendantList<SN, DN>,
      options: AddDescendantOptions<SN, DN> = {}
    ): void {
      let { sectionName, feId } = this.self
        .feInfo as FeSelfOrDescendantInfo<SN>;

      for (let i = 0; i < descendantPath.length; i++) {
        const childName = descendantPath[i];
        if (
          this.isValidChildNameOrThrow(sectionName as SectionName, childName)
        ) {
          const commonProps = {
            parentInfo: { sectionName, feId } as FeParentInfo<typeof childName>,
            sectionName: childName,
          };
          if (i === descendantPath.length - 1) {
            this.addOneSection({
              ...options,
              ...commonProps,
            });
          } else if (this.sections.list(childName).isEmpty) {
            this.addOneSection(commonProps);
          }
        }
        ({ sectionName, feId } = {
          sectionName: childName as any,
          feId: this.sections.list(childName).last.feId,
        });
      }
    }
    addChild<CN extends ChildName<SN>>(
      childName: CN,
      options?: AddChildOptions<SN>
    ): void {
      this.addOneSection({
        ...options,
        sectionName: childName,
        parentInfo: this.self.feInfo as FeSectionInfo as FeParentInfo<CN>,
        // to preven bugs like this, I ought to convert parentInfo to what it should
      } as AddSectionPropsNext<DescendantName<SN>>);
    }

    addOneSection<S extends SectionName>(props: AddSectionPropsNext<S>): void {
      this.newSectionToList(props);
      if (sectionNameS.is(props.sectionName, "hasParent")) {
        this.addChildFeIdToParent(
          props as AddSectionPropsNext<SectionName<"hasParent">>
        );
      }
    }
    addSections(parentFirstPropsArr: AddSectionPropsNext[]): void {
      for (const props of parentFirstPropsArr as AddSectionPropsNext[]) {
        this.addOneSection(props);
      }
    }
    private isValidChildNameOrThrow<SN extends SectionName>(
      sectionName: SN,
      childName: SectionName
    ): childName is ChildName<SN> {
      const { meta } = this.sections.list(sectionName);
      if (!meta.isChildName(childName)) {
        throw new Error(`${childName} is not a child of ${sectionName}`);
      } else return true;
    }
    private newSectionToList(props: AddSectionPropsNext) {
      const { sectionName } = props;
      const sectionList = this.sections.list(sectionName);
      this.sections.updateList(sectionList.push(FeSection.initNext(props)));
    }
    private addChildFeIdToParent(
      props: StrictOmit<NewSectionInfo<"hasParent">, "feId">
    ) {
      const { feParentInfo, feId } = this.sections.list(props.sectionName).last;
      const parent = this.sections
        .one(feParentInfo)
        .addChildFeId({ ...props, feId });
      this.sections.updateSection(parent as any);
    }
  };
}

export const DescendantAdder = ApplyDescendantAdderNext(FocalSectionBase);

export type DescendantList<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = readonly [...DescendantName<SN>[], DN];

type OmitProps = "sectionName" | "parentInfo" | "childFeIds";

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, OmitProps>;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = StrictOmit<AddSectionPropsNext<DN>, OmitProps>;
